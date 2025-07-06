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
const chatbot_modal_1 = require("./chatbot-modal");
const settings_1 = require("./settings");
class HelloWorldPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading Hello World Plugin');
            // Load settings
            yield this.loadSettings();
            // Add settings tab
            this.addSettingTab(new settings_1.ChatbotSettingTab(this.app, this));
            // This creates an icon in the left ribbon for the chatbot.
            this.addRibbonIcon('message-circle', 'Open Document Chatbot', () => {
                new chatbot_modal_1.ChatbotModal(this.app, this).open();
            });
            // Add command for opening chatbot
            this.addCommand({
                id: 'open-document-chatbot',
                name: 'Open Document Chatbot',
                callback: () => {
                    new chatbot_modal_1.ChatbotModal(this.app, this).open();
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
            this.settings = Object.assign({}, settings_1.DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
exports.default = HelloWorldPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTBDO0FBQzFDLG1EQUErQztBQUMvQyx5Q0FBa0Y7QUFFbEYsTUFBcUIsZ0JBQWlCLFNBQVEsaUJBQU07SUFHN0MsTUFBTTs7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFMUMsZ0JBQWdCO1lBQ2hCLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRTFCLG1CQUFtQjtZQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksNEJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRTFELDJEQUEyRDtZQUMzRCxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtnQkFDbEUsSUFBSSw0QkFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7WUFFSCxrQ0FBa0M7WUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDZixFQUFFLEVBQUUsdUJBQXVCO2dCQUMzQixJQUFJLEVBQUUsdUJBQXVCO2dCQUM3QixRQUFRLEVBQUUsR0FBRyxFQUFFO29CQUNkLElBQUksNEJBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QyxDQUFDO2FBQ0QsQ0FBQyxDQUFDO1lBRUgsd0NBQXdDO1lBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pELElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVELFFBQVE7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVLLFlBQVk7O1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsMkJBQWdCLEVBQUUsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO0tBQUE7SUFFSyxZQUFZOztZQUNqQixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7S0FBQTtDQUNEO0FBM0NELG1DQTJDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsdWdpbiwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgQ2hhdGJvdE1vZGFsIH0gZnJvbSAnLi9jaGF0Ym90LW1vZGFsJztcbmltcG9ydCB7IENoYXRib3RTZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUywgQ2hhdGJvdFNldHRpbmdUYWIgfSBmcm9tICcuL3NldHRpbmdzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVsbG9Xb3JsZFBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG5cdHNldHRpbmdzOiBDaGF0Ym90U2V0dGluZ3M7XG5cblx0YXN5bmMgb25sb2FkKCkge1xuXHRcdGNvbnNvbGUubG9nKCdMb2FkaW5nIEhlbGxvIFdvcmxkIFBsdWdpbicpO1xuXG5cdFx0Ly8gTG9hZCBzZXR0aW5nc1xuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cblx0XHQvLyBBZGQgc2V0dGluZ3MgdGFiXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBDaGF0Ym90U2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG5cdFx0Ly8gVGhpcyBjcmVhdGVzIGFuIGljb24gaW4gdGhlIGxlZnQgcmliYm9uIGZvciB0aGUgY2hhdGJvdC5cblx0XHR0aGlzLmFkZFJpYmJvbkljb24oJ21lc3NhZ2UtY2lyY2xlJywgJ09wZW4gRG9jdW1lbnQgQ2hhdGJvdCcsICgpID0+IHtcblx0XHRcdG5ldyBDaGF0Ym90TW9kYWwodGhpcy5hcHAsIHRoaXMpLm9wZW4oKTtcblx0XHR9KTtcblxuXHRcdC8vIEFkZCBjb21tYW5kIGZvciBvcGVuaW5nIGNoYXRib3Rcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdvcGVuLWRvY3VtZW50LWNoYXRib3QnLFxuXHRcdFx0bmFtZTogJ09wZW4gRG9jdW1lbnQgQ2hhdGJvdCcsXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xuXHRcdFx0XHRuZXcgQ2hhdGJvdE1vZGFsKHRoaXMuYXBwLCB0aGlzKS5vcGVuKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBLZWVwIHRoZSBvcmlnaW5hbCBoZWxsbyBmdW5jdGlvbmFsaXR5XG5cdFx0dGhpcy5hZGRSaWJib25JY29uKCdsYW5ndWFnZXMnLCAnU2F5IEhlbGxvJywgKCkgPT4ge1xuXHRcdFx0bmV3IE5vdGljZSgnSGVsbG8sIENobG9lIScpO1xuXHRcdH0pO1xuXHR9XG5cblx0b251bmxvYWQoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1VubG9hZGluZyBIZWxsbyBXb3JsZCBQbHVnaW4nKTtcblx0fVxuXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcblx0fVxuXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuXHR9XG59Il19