"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");

// Settings interface and defaults
const DEFAULT_SETTINGS = {
    deepseekApiKey: '',
    model: 'deepseek-chat'
};

// Settings tab class
class ChatbotSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Chatbot Settings' });
        new obsidian_1.Setting(containerEl)
            .setName('DeepSeek API Key')
            .setDesc('Enter your DeepSeek API key to enable chatbot functionality')
            .addText(text => text
            .setPlaceholder('sk-...')
            .setValue(this.plugin.settings.deepseekApiKey)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.deepseekApiKey = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Model')
            .setDesc('Choose the DeepSeek model to use')
            .addDropdown(dropdown => dropdown
            .addOption('deepseek-chat', 'DeepSeek Chat')
            .addOption('deepseek-coder', 'DeepSeek Coder')
            .setValue(this.plugin.settings.model)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.model = value;
            yield this.plugin.saveSettings();
        })));
    }
}

// Chatbot modal class
class ChatbotModal extends obsidian_1.Modal {
    constructor(app, plugin) {
        super(app);
        this.messages = [];
        this.currentDocument = '';
        this.plugin = plugin;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Get current document content
        this.getCurrentDocumentContent();

        // Set up the modal
        contentEl.addClass('chatbot-modal');
        
        const header = contentEl.createEl('div', { cls: 'chatbot-header' });
        header.createEl('h2', { text: 'Document Chat Assistant' });
        
        const docInfo = header.createEl('div', { cls: 'document-info' });
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
            docInfo.textContent = `Chatting about: ${activeFile.name}`;
        } else {
            docInfo.textContent = 'No active document';
        }

        // Chat container
        this.chatContainer = contentEl.createEl('div', { cls: 'chat-container' });
        this.chatContainer.style.height = '400px';
        this.chatContainer.style.overflowY = 'auto';
        this.chatContainer.style.border = '1px solid var(--background-modifier-border)';
        this.chatContainer.style.borderRadius = '8px';
        this.chatContainer.style.padding = '16px';
        this.chatContainer.style.marginBottom = '16px';

        // Initial message
        if (this.currentDocument) {
            this.addMessage('assistant', 'Hello! I\'m ready to help you with questions about this document. What would you like to know?');
        } else {
            this.addMessage('assistant', 'Please open a document first to start chatting about it.');
        }

        // Input area
        const inputContainer = contentEl.createEl('div', { cls: 'input-container' });
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '8px';

        this.inputElement = inputContainer.createEl('textarea', { cls: 'chat-input' });
        this.inputElement.placeholder = 'Ask a question about the document...';
        this.inputElement.style.flex = '1';
        this.inputElement.style.minHeight = '60px';
        this.inputElement.style.resize = 'vertical';

        this.sendButton = inputContainer.createEl('button', { text: 'Send', cls: 'mod-cta' });
        this.sendButton.style.height = 'fit-content';
        this.sendButton.style.alignSelf = 'flex-end';

        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Add some styling
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-modal .modal-content {
                max-width: 800px;
                width: 90vw;
            }
            .chat-message {
                margin-bottom: 16px;
                padding: 12px;
                border-radius: 8px;
            }
            .chat-message.user {
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
                margin-left: 20%;
            }
            .chat-message.assistant {
                background-color: var(--background-secondary);
                margin-right: 20%;
            }
            .message-content {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .message-timestamp {
                font-size: 0.8em;
                opacity: 0.7;
                margin-top: 4px;
            }
            .document-info {
                font-size: 0.9em;
                opacity: 0.8;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    getCurrentDocumentContent() {
        const activeView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
        if (activeView && activeView.file) {
            this.app.vault.read(activeView.file).then(content => {
                this.currentDocument = content;
            });
        }
    }

    addMessage(role, content) {
        const message = {
            role,
            content,
            timestamp: new Date()
        };
        this.messages.push(message);

        const messageEl = this.chatContainer.createEl('div', { cls: `chat-message ${role}` });
        
        const contentEl = messageEl.createEl('div', { cls: 'message-content' });
        contentEl.textContent = content;
        
        const timestampEl = messageEl.createEl('div', { cls: 'message-timestamp' });
        timestampEl.textContent = message.timestamp.toLocaleTimeString();

        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    sendMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const userMessage = this.inputElement.value.trim();
            if (!userMessage) return;

            if (!this.currentDocument) {
                new obsidian_1.Notice('Please open a document first');
                return;
            }

            if (!this.plugin.settings.deepseekApiKey) {
                new obsidian_1.Notice('Please configure your DeepSeek API key in settings');
                return;
            }

            // Add user message
            this.addMessage('user', userMessage);
            this.inputElement.value = '';
            this.sendButton.disabled = true;
            this.sendButton.textContent = 'Sending...';

            try {
                const response = yield this.callDeepSeekAPI(userMessage);
                this.addMessage('assistant', response);
            } catch (error) {
                console.error('Error calling DeepSeek API:', error);
                this.addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please check your API key and try again.');
            } finally {
                this.sendButton.disabled = false;
                this.sendButton.textContent = 'Send';
            }
        });
    }

    callDeepSeekAPI(userMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [
                {
                    role: 'system',
                    content: `You are a helpful assistant that answers questions about documents. Here is the document content:\n\n${this.currentDocument}\n\nPlease answer questions based on this document content. Be concise and helpful.`
                },
                ...this.messages.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: userMessage
                }
            ];

            const response = yield fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.plugin.settings.deepseekApiKey}`
                },
                body: JSON.stringify({
                    model: this.plugin.settings.model,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = yield response.json();
            return data.choices[0].message.content;
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Main plugin class
class HelloWorldPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading Hello World Plugin');

            // Load settings
            yield this.loadSettings();

            // Add settings tab
            this.addSettingTab(new ChatbotSettingTab(this.app, this));

            // This creates an icon in the left ribbon for the chatbot.
            this.addRibbonIcon('message-circle', 'Open Document Chatbot', () => {
                new ChatbotModal(this.app, this).open();
            });

            // Add command for opening chatbot
            this.addCommand({
                id: 'open-document-chatbot',
                name: 'Open Document Chatbot',
                callback: () => {
                    new ChatbotModal(this.app, this).open();
                }
            });

            // Keep the original hello functionality
            this.addRibbonIcon('languages', 'Say Hello', () => {
                new obsidian_1.Notice('Hello, Chloe!');
            });
        });
    }

    onunload() {
        console.log('Unloading Hello World Plugin');
    }

    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }

    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

exports.default = HelloWorldPlugin;
