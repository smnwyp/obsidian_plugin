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
exports.ChatbotSettingTab = exports.DEFAULT_SETTINGS = void 0;
const obsidian_1 = require("obsidian");
exports.DEFAULT_SETTINGS = {
    deepseekApiKey: 'sk-37184e11a55346a1963388d67c87249f',
    model: 'deepseek-chat'
};
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
exports.ChatbotSettingTab = ChatbotSettingTab;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTBEO0FBUTdDLFFBQUEsZ0JBQWdCLEdBQW9CO0lBQ2hELGNBQWMsRUFBRSxxQ0FBcUM7SUFDckQsS0FBSyxFQUFFLGVBQWU7Q0FDdEIsQ0FBQztBQUVGLE1BQWEsaUJBQWtCLFNBQVEsMkJBQWdCO0lBR3RELFlBQVksR0FBUSxFQUFFLE1BQXdCO1FBQzdDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUVELE9BQU87UUFDTixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRTdCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVwQixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFFekQsSUFBSSxrQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUN0QixPQUFPLENBQUMsa0JBQWtCLENBQUM7YUFDM0IsT0FBTyxDQUFDLDZEQUE2RCxDQUFDO2FBQ3RFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7YUFDbkIsY0FBYyxDQUFDLFFBQVEsQ0FBQzthQUN4QixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO2FBQzdDLFFBQVEsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUVOLElBQUksa0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDdEIsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNoQixPQUFPLENBQUMsa0NBQWtDLENBQUM7YUFDM0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUTthQUMvQixTQUFTLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQzthQUMzQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7YUFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQzthQUNwQyxRQUFRLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25DLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0Q7QUF0Q0QsOENBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IEhlbGxvV29ybGRQbHVnaW4gZnJvbSAnLi9tYWluJztcblxuZXhwb3J0IGludGVyZmFjZSBDaGF0Ym90U2V0dGluZ3Mge1xuXHRkZWVwc2Vla0FwaUtleTogc3RyaW5nO1xuXHRtb2RlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogQ2hhdGJvdFNldHRpbmdzID0ge1xuXHRkZWVwc2Vla0FwaUtleTogJ3NrLTM3MTg0ZTExYTU1MzQ2YTE5NjMzODhkNjdjODcyNDlmJyxcblx0bW9kZWw6ICdkZWVwc2Vlay1jaGF0J1xufTtcblxuZXhwb3J0IGNsYXNzIENoYXRib3RTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG5cdHBsdWdpbjogSGVsbG9Xb3JsZFBsdWdpbjtcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBIZWxsb1dvcmxkUGx1Z2luKSB7XG5cdFx0c3VwZXIoYXBwLCBwbHVnaW4pO1xuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xuXHR9XG5cblx0ZGlzcGxheSgpOiB2b2lkIHtcblx0XHRjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcblxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ0NoYXRib3QgU2V0dGluZ3MnIH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZSgnRGVlcFNlZWsgQVBJIEtleScpXG5cdFx0XHQuc2V0RGVzYygnRW50ZXIgeW91ciBEZWVwU2VlayBBUEkga2V5IHRvIGVuYWJsZSBjaGF0Ym90IGZ1bmN0aW9uYWxpdHknKVxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignc2stLi4uJylcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlZXBzZWVrQXBpS2V5KVxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVlcHNlZWtBcGlLZXkgPSB2YWx1ZTtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0fSkpO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZSgnTW9kZWwnKVxuXHRcdFx0LnNldERlc2MoJ0Nob29zZSB0aGUgRGVlcFNlZWsgbW9kZWwgdG8gdXNlJylcblx0XHRcdC5hZGREcm9wZG93bihkcm9wZG93biA9PiBkcm9wZG93blxuXHRcdFx0XHQuYWRkT3B0aW9uKCdkZWVwc2Vlay1jaGF0JywgJ0RlZXBTZWVrIENoYXQnKVxuXHRcdFx0XHQuYWRkT3B0aW9uKCdkZWVwc2Vlay1jb2RlcicsICdEZWVwU2VlayBDb2RlcicpXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlbClcblx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGVsID0gdmFsdWU7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdH0pKTtcblx0fVxufSJdfQ==