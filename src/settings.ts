import { App, PluginSettingTab, Setting } from 'obsidian';
import HelloWorldPlugin from './main';

export interface ChatbotSettings {
	deepseekApiKey: string;
	model: string;
}

export const DEFAULT_SETTINGS: ChatbotSettings = {
	deepseekApiKey: 'sk-37184e11a55346a1963388d67c87249f',
	model: 'deepseek-chat'
};

export class ChatbotSettingTab extends PluginSettingTab {
	plugin: HelloWorldPlugin;

	constructor(app: App, plugin: HelloWorldPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Chatbot Settings' });

		new Setting(containerEl)
			.setName('DeepSeek API Key')
			.setDesc('Enter your DeepSeek API key to enable chatbot functionality')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.deepseekApiKey)
				.onChange(async (value) => {
					this.plugin.settings.deepseekApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Model')
			.setDesc('Choose the DeepSeek model to use')
			.addDropdown(dropdown => dropdown
				.addOption('deepseek-chat', 'DeepSeek Chat')
				.addOption('deepseek-coder', 'DeepSeek Coder')
				.setValue(this.plugin.settings.model)
				.onChange(async (value) => {
					this.plugin.settings.model = value;
					await this.plugin.saveSettings();
				}));
	}
}