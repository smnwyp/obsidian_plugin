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
exports.ChatbotModal = void 0;
const obsidian_1 = require("obsidian");
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
        }
        else {
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
        }
        else {
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
            if (!userMessage)
                return;
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
            }
            catch (error) {
                console.error('Error calling DeepSeek API:', error);
                this.addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please check your API key and try again.');
            }
            finally {
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
exports.ChatbotModal = ChatbotModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdGJvdC1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9jaGF0Ym90LW1vZGFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUE0RTtBQVM1RSxNQUFhLFlBQWEsU0FBUSxnQkFBSztJQVF0QyxZQUFZLEdBQVEsRUFBRSxNQUF3QjtRQUM3QyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFKWixhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3QixvQkFBZSxHQUFXLEVBQUUsQ0FBQztRQUk1QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTTtRQUNMLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDM0IsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWxCLCtCQUErQjtRQUMvQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUVqQyxtQkFBbUI7UUFDbkIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVwQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxDQUFDO1FBRTNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDakUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEQsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNoQixPQUFPLENBQUMsV0FBVyxHQUFHLG1CQUFtQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7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UUFBUTtvQkFDbEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFdBQVcsRUFBRSxHQUFHO2lCQUNoQixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsUUFBUSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUNsRixDQUFDO1lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRUQsT0FBTztRQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDM0IsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25CLENBQUM7Q0FDRDtBQXhORCxvQ0F3TkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIE1vZGFsLCBTZXR0aW5nLCBOb3RpY2UsIE1hcmtkb3duVmlldywgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgSGVsbG9Xb3JsZFBsdWdpbiBmcm9tICcuL21haW4nO1xuXG5pbnRlcmZhY2UgQ2hhdE1lc3NhZ2Uge1xuXHRyb2xlOiAndXNlcicgfCAnYXNzaXN0YW50Jztcblx0Y29udGVudDogc3RyaW5nO1xuXHR0aW1lc3RhbXA6IERhdGU7XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0Ym90TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG5cdHBsdWdpbjogSGVsbG9Xb3JsZFBsdWdpbjtcblx0Y2hhdENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cdGlucHV0RWxlbWVudDogSFRNTFRleHRBcmVhRWxlbWVudDtcblx0c2VuZEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cdG1lc3NhZ2VzOiBDaGF0TWVzc2FnZVtdID0gW107XG5cdGN1cnJlbnREb2N1bWVudDogc3RyaW5nID0gJyc7XG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogSGVsbG9Xb3JsZFBsdWdpbikge1xuXHRcdHN1cGVyKGFwcCk7XG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XG5cdH1cblxuXHRvbk9wZW4oKSB7XG5cdFx0Y29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG5cdFx0Y29udGVudEVsLmVtcHR5KCk7XG5cdFx0XG5cdFx0Ly8gR2V0IGN1cnJlbnQgZG9jdW1lbnQgY29udGVudFxuXHRcdHRoaXMuZ2V0Q3VycmVudERvY3VtZW50Q29udGVudCgpO1xuXG5cdFx0Ly8gU2V0IHVwIHRoZSBtb2RhbFxuXHRcdGNvbnRlbnRFbC5hZGRDbGFzcygnY2hhdGJvdC1tb2RhbCcpO1xuXHRcdFxuXHRcdGNvbnN0IGhlYWRlciA9IGNvbnRlbnRFbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdjaGF0Ym90LWhlYWRlcicgfSk7XG5cdFx0aGVhZGVyLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ0RvY3VtZW50IENoYXQgQXNzaXN0YW50JyB9KTtcblx0XHRcblx0XHRjb25zdCBkb2NJbmZvID0gaGVhZGVyLmNyZWF0ZUVsKCdkaXYnLCB7IGNsczogJ2RvY3VtZW50LWluZm8nIH0pO1xuXHRcdGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXHRcdGlmIChhY3RpdmVGaWxlKSB7XG5cdFx0XHRkb2NJbmZvLnRleHRDb250ZW50ID0gYENoYXR0aW5nIGFib3V0OiAke2FjdGl2ZUZpbGUubmFtZX1gO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2NJbmZvLnRleHRDb250ZW50ID0gJ05vIGFjdGl2ZSBkb2N1bWVudCc7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hhdCBjb250YWluZXJcblx0XHR0aGlzLmNoYXRDb250YWluZXIgPSBjb250ZW50RWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAnY2hhdC1jb250YWluZXInIH0pO1xuXHRcdHRoaXMuY2hhdENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnNDAwcHgnO1xuXHRcdHRoaXMuY2hhdENvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG5cdFx0dGhpcy5jaGF0Q29udGFpbmVyLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpJztcblx0XHR0aGlzLmNoYXRDb250YWluZXIuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzhweCc7XG5cdFx0dGhpcy5jaGF0Q29udGFpbmVyLnN0eWxlLnBhZGRpbmcgPSAnMTZweCc7XG5cdFx0dGhpcy5jaGF0Q29udGFpbmVyLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxNnB4JztcblxuXHRcdC8vIEluaXRpYWwgbWVzc2FnZVxuXHRcdGlmICh0aGlzLmN1cnJlbnREb2N1bWVudCkge1xuXHRcdFx0dGhpcy5hZGRNZXNzYWdlKCdhc3Npc3RhbnQnLCAnSGVsbG8hIElcXCdtIHJlYWR5IHRvIGhlbHAgeW91IHdpdGggcXVlc3Rpb25zIGFib3V0IHRoaXMgZG9jdW1lbnQuIFdoYXQgd291bGQgeW91IGxpa2UgdG8ga25vdz8nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5hZGRNZXNzYWdlKCdhc3Npc3RhbnQnLCAnUGxlYXNlIG9wZW4gYSBkb2N1bWVudCBmaXJzdCB0byBzdGFydCBjaGF0dGluZyBhYm91dCBpdC4nKTtcblx0XHR9XG5cblx0XHQvLyBJbnB1dCBhcmVhXG5cdFx0Y29uc3QgaW5wdXRDb250YWluZXIgPSBjb250ZW50RWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAnaW5wdXQtY29udGFpbmVyJyB9KTtcblx0XHRpbnB1dENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuXHRcdGlucHV0Q29udGFpbmVyLnN0eWxlLmdhcCA9ICc4cHgnO1xuXG5cdFx0dGhpcy5pbnB1dEVsZW1lbnQgPSBpbnB1dENvbnRhaW5lci5jcmVhdGVFbCgndGV4dGFyZWEnLCB7IGNsczogJ2NoYXQtaW5wdXQnIH0pO1xuXHRcdHRoaXMuaW5wdXRFbGVtZW50LnBsYWNlaG9sZGVyID0gJ0FzayBhIHF1ZXN0aW9uIGFib3V0IHRoZSBkb2N1bWVudC4uLic7XG5cdFx0dGhpcy5pbnB1dEVsZW1lbnQuc3R5bGUuZmxleCA9ICcxJztcblx0XHR0aGlzLmlucHV0RWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSAnNjBweCc7XG5cdFx0dGhpcy5pbnB1dEVsZW1lbnQuc3R5bGUucmVzaXplID0gJ3ZlcnRpY2FsJztcblxuXHRcdHRoaXMuc2VuZEJ1dHRvbiA9IGlucHV0Q29udGFpbmVyLmNyZWF0ZUVsKCdidXR0b24nLCB7IHRleHQ6ICdTZW5kJywgY2xzOiAnbW9kLWN0YScgfSk7XG5cdFx0dGhpcy5zZW5kQnV0dG9uLnN0eWxlLmhlaWdodCA9ICdmaXQtY29udGVudCc7XG5cdFx0dGhpcy5zZW5kQnV0dG9uLnN0eWxlLmFsaWduU2VsZiA9ICdmbGV4LWVuZCc7XG5cblx0XHQvLyBFdmVudCBsaXN0ZW5lcnNcblx0XHR0aGlzLnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnNlbmRNZXNzYWdlKCkpO1xuXHRcdHRoaXMuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0aWYgKGUua2V5ID09PSAnRW50ZXInICYmICFlLnNoaWZ0S2V5KSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dGhpcy5zZW5kTWVzc2FnZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gQWRkIHNvbWUgc3R5bGluZ1xuXHRcdGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblx0XHRzdHlsZS50ZXh0Q29udGVudCA9IGBcblx0XHRcdC5jaGF0Ym90LW1vZGFsIC5tb2RhbC1jb250ZW50IHtcblx0XHRcdFx0bWF4LXdpZHRoOiA4MDBweDtcblx0XHRcdFx0d2lkdGg6IDkwdnc7XG5cdFx0XHR9XG5cdFx0XHQuY2hhdC1tZXNzYWdlIHtcblx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMTZweDtcblx0XHRcdFx0cGFkZGluZzogMTJweDtcblx0XHRcdFx0Ym9yZGVyLXJhZGl1czogOHB4O1xuXHRcdFx0fVxuXHRcdFx0LmNoYXQtbWVzc2FnZS51c2VyIHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcblx0XHRcdFx0Y29sb3I6IHZhcigtLXRleHQtb24tYWNjZW50KTtcblx0XHRcdFx0bWFyZ2luLWxlZnQ6IDIwJTtcblx0XHRcdH1cblx0XHRcdC5jaGF0LW1lc3NhZ2UuYXNzaXN0YW50IHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuXHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDIwJTtcblx0XHRcdH1cblx0XHRcdC5tZXNzYWdlLWNvbnRlbnQge1xuXHRcdFx0XHR3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG5cdFx0XHRcdHdvcmQtd3JhcDogYnJlYWstd29yZDtcblx0XHRcdH1cblx0XHRcdC5tZXNzYWdlLXRpbWVzdGFtcCB7XG5cdFx0XHRcdGZvbnQtc2l6ZTogMC44ZW07XG5cdFx0XHRcdG9wYWNpdHk6IDAuNztcblx0XHRcdFx0bWFyZ2luLXRvcDogNHB4O1xuXHRcdFx0fVxuXHRcdFx0LmRvY3VtZW50LWluZm8ge1xuXHRcdFx0XHRmb250LXNpemU6IDAuOWVtO1xuXHRcdFx0XHRvcGFjaXR5OiAwLjg7XG5cdFx0XHRcdG1hcmdpbi10b3A6IDRweDtcblx0XHRcdH1cblx0XHRgO1xuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9XG5cblx0Z2V0Q3VycmVudERvY3VtZW50Q29udGVudCgpIHtcblx0XHRjb25zdCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblx0XHRpZiAoYWN0aXZlVmlldyAmJiBhY3RpdmVWaWV3LmZpbGUpIHtcblx0XHRcdHRoaXMuYXBwLnZhdWx0LnJlYWQoYWN0aXZlVmlldy5maWxlKS50aGVuKGNvbnRlbnQgPT4ge1xuXHRcdFx0XHR0aGlzLmN1cnJlbnREb2N1bWVudCA9IGNvbnRlbnQ7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRhZGRNZXNzYWdlKHJvbGU6ICd1c2VyJyB8ICdhc3Npc3RhbnQnLCBjb250ZW50OiBzdHJpbmcpIHtcblx0XHRjb25zdCBtZXNzYWdlOiBDaGF0TWVzc2FnZSA9IHtcblx0XHRcdHJvbGUsXG5cdFx0XHRjb250ZW50LFxuXHRcdFx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpXG5cdFx0fTtcblx0XHR0aGlzLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG5cblx0XHRjb25zdCBtZXNzYWdlRWwgPSB0aGlzLmNoYXRDb250YWluZXIuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiBgY2hhdC1tZXNzYWdlICR7cm9sZX1gIH0pO1xuXHRcdFxuXHRcdGNvbnN0IGNvbnRlbnRFbCA9IG1lc3NhZ2VFbC5jcmVhdGVFbCgnZGl2JywgeyBjbHM6ICdtZXNzYWdlLWNvbnRlbnQnIH0pO1xuXHRcdGNvbnRlbnRFbC50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG5cdFx0XG5cdFx0Y29uc3QgdGltZXN0YW1wRWwgPSBtZXNzYWdlRWwuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAnbWVzc2FnZS10aW1lc3RhbXAnIH0pO1xuXHRcdHRpbWVzdGFtcEVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50aW1lc3RhbXAudG9Mb2NhbGVUaW1lU3RyaW5nKCk7XG5cblx0XHQvLyBTY3JvbGwgdG8gYm90dG9tXG5cdFx0dGhpcy5jaGF0Q29udGFpbmVyLnNjcm9sbFRvcCA9IHRoaXMuY2hhdENvbnRhaW5lci5zY3JvbGxIZWlnaHQ7XG5cdH1cblxuXHRhc3luYyBzZW5kTWVzc2FnZSgpIHtcblx0XHRjb25zdCB1c2VyTWVzc2FnZSA9IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoIXVzZXJNZXNzYWdlKSByZXR1cm47XG5cblx0XHRpZiAoIXRoaXMuY3VycmVudERvY3VtZW50KSB7XG5cdFx0XHRuZXcgTm90aWNlKCdQbGVhc2Ugb3BlbiBhIGRvY3VtZW50IGZpcnN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWVwc2Vla0FwaUtleSkge1xuXHRcdFx0bmV3IE5vdGljZSgnUGxlYXNlIGNvbmZpZ3VyZSB5b3VyIERlZXBTZWVrIEFQSSBrZXkgaW4gc2V0dGluZ3MnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBBZGQgdXNlciBtZXNzYWdlXG5cdFx0dGhpcy5hZGRNZXNzYWdlKCd1c2VyJywgdXNlck1lc3NhZ2UpO1xuXHRcdHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID0gJyc7XG5cdFx0dGhpcy5zZW5kQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblx0XHR0aGlzLnNlbmRCdXR0b24udGV4dENvbnRlbnQgPSAnU2VuZGluZy4uLic7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNhbGxEZWVwU2Vla0FQSSh1c2VyTWVzc2FnZSk7XG5cdFx0XHR0aGlzLmFkZE1lc3NhZ2UoJ2Fzc2lzdGFudCcsIHJlc3BvbnNlKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgY2FsbGluZyBEZWVwU2VlayBBUEk6JywgZXJyb3IpO1xuXHRcdFx0dGhpcy5hZGRNZXNzYWdlKCdhc3Npc3RhbnQnLCAnU29ycnksIEkgZW5jb3VudGVyZWQgYW4gZXJyb3Igd2hpbGUgcHJvY2Vzc2luZyB5b3VyIHJlcXVlc3QuIFBsZWFzZSBjaGVjayB5b3VyIEFQSSBrZXkgYW5kIHRyeSBhZ2Fpbi4nKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy5zZW5kQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHR0aGlzLnNlbmRCdXR0b24udGV4dENvbnRlbnQgPSAnU2VuZCc7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgY2FsbERlZXBTZWVrQVBJKHVzZXJNZXNzYWdlOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdGNvbnN0IG1lc3NhZ2VzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRyb2xlOiAnc3lzdGVtJyxcblx0XHRcdFx0Y29udGVudDogYFlvdSBhcmUgYSBoZWxwZnVsIGFzc2lzdGFudCB0aGF0IGFuc3dlcnMgcXVlc3Rpb25zIGFib3V0IGRvY3VtZW50cy4gSGVyZSBpcyB0aGUgZG9jdW1lbnQgY29udGVudDpcXG5cXG4ke3RoaXMuY3VycmVudERvY3VtZW50fVxcblxcblBsZWFzZSBhbnN3ZXIgcXVlc3Rpb25zIGJhc2VkIG9uIHRoaXMgZG9jdW1lbnQgY29udGVudC4gQmUgY29uY2lzZSBhbmQgaGVscGZ1bC5gXG5cdFx0XHR9LFxuXHRcdFx0Li4udGhpcy5tZXNzYWdlcy5zbGljZSgtMTApLm1hcChtc2cgPT4gKHsgLy8gS2VlcCBsYXN0IDEwIG1lc3NhZ2VzIGZvciBjb250ZXh0XG5cdFx0XHRcdHJvbGU6IG1zZy5yb2xlLFxuXHRcdFx0XHRjb250ZW50OiBtc2cuY29udGVudFxuXHRcdFx0fSkpLFxuXHRcdFx0e1xuXHRcdFx0XHRyb2xlOiAndXNlcicsXG5cdFx0XHRcdGNvbnRlbnQ6IHVzZXJNZXNzYWdlXG5cdFx0XHR9XG5cdFx0XTtcblxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYXBpLmRlZXBzZWVrLmNvbS92MS9jaGF0L2NvbXBsZXRpb25zJywge1xuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRoZWFkZXJzOiB7XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdCdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMucGx1Z2luLnNldHRpbmdzLmRlZXBzZWVrQXBpS2V5fWBcblx0XHRcdH0sXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdG1vZGVsOiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlbCxcblx0XHRcdFx0bWVzc2FnZXM6IG1lc3NhZ2VzLFxuXHRcdFx0XHRtYXhfdG9rZW5zOiAxMDAwLFxuXHRcdFx0XHR0ZW1wZXJhdHVyZTogMC43XG5cdFx0XHR9KVxuXHRcdH0pO1xuXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBBUEkgcmVxdWVzdCBmYWlsZWQ6ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblx0XHRyZXR1cm4gZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudDtcblx0fVxuXG5cdG9uQ2xvc2UoKSB7XG5cdFx0Y29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG5cdFx0Y29udGVudEVsLmVtcHR5KCk7XG5cdH1cbn0iXX0=