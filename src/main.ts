import { Plugin, Notice } from 'obsidian';

export default class HelloWorldPlugin extends Plugin {
	async onload() {
		console.log('Loading Hello World Plugin');

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('languages', 'Say Hello', () => {
			// Called when the user clicks the icon.
			new Notice('Hello, Chloe!');
		});
	}

	onunload() {
		console.log('Unloading Hello World Plugin');
	}
}