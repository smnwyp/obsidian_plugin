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
class HelloWorldPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading Hello World Plugin');
            // This creates an icon in the left ribbon.
            this.addRibbonIcon('languages', 'Say Hello', () => {
                // Called when the user clicks the icon.
                new obsidian_1.Notice('Hello, Chloe!');
            });
        });
    }
    onunload() {
        console.log('Unloading Hello World Plugin');
    }
}
exports.default = HelloWorldPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTBDO0FBRTFDLE1BQXFCLGdCQUFpQixTQUFRLGlCQUFNO0lBQzdDLE1BQU07O1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRTFDLDJDQUEyQztZQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNqRCx3Q0FBd0M7Z0JBQ3hDLElBQUksaUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVELFFBQVE7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNEO0FBZEQsbUNBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW4sIE5vdGljZSB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVsbG9Xb3JsZFBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG5cdGFzeW5jIG9ubG9hZCgpIHtcblx0XHRjb25zb2xlLmxvZygnTG9hZGluZyBIZWxsbyBXb3JsZCBQbHVnaW4nKTtcblxuXHRcdC8vIFRoaXMgY3JlYXRlcyBhbiBpY29uIGluIHRoZSBsZWZ0IHJpYmJvbi5cblx0XHR0aGlzLmFkZFJpYmJvbkljb24oJ2xhbmd1YWdlcycsICdTYXkgSGVsbG8nLCAoKSA9PiB7XG5cdFx0XHQvLyBDYWxsZWQgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIGljb24uXG5cdFx0XHRuZXcgTm90aWNlKCdIZWxsbywgQ2hsb2UhJyk7XG5cdFx0fSk7XG5cdH1cblxuXHRvbnVubG9hZCgpIHtcblx0XHRjb25zb2xlLmxvZygnVW5sb2FkaW5nIEhlbGxvIFdvcmxkIFBsdWdpbicpO1xuXHR9XG59Il19