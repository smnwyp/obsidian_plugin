import { Plugin, Notice } from 'obsidian';
import { ChatbotModal } from './chatbot-modal';
import { ChatbotSettings, DEFAULT_SETTINGS, ChatbotSettingTab } from './settings';

export default class HelloWorldPlugin extends Plugin {
	settings: ChatbotSettings;

	async onload() {
		console.log('Loading Hello World Plugin');

		// Load settings
		await this.loadSettings();

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
			new Notice('Hello, Chloe!');
		});
	}

	onunload() {
		console.log('Unloading Hello World Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}