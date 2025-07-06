# Document Chatbot Plugin for Obsidian

This plugin allows you to chat with your documents using the DeepSeek AI API. You can ask questions about the content of your currently active document and get intelligent responses.

## Features

- 🤖 Chat with your documents using DeepSeek AI
- 💬 Interactive chat interface with conversation history
- 📝 Automatically uses the current active document as context
- ⚙️ Configurable API settings
- 🎨 Clean, modern UI that integrates with Obsidian's theme

## Setup

1. **Get a DeepSeek API Key**
   - Visit [DeepSeek Platform](https://platform.deepseek.com/)
   - Create an account and obtain an API key

2. **Configure the Plugin**
   - Open Obsidian Settings
   - Navigate to "Community plugins" → "Document Chatbot Plugin"
   - Enter your DeepSeek API key
   - Choose your preferred model (deepseek-chat or deepseek-coder)

## Usage

### Opening the Chatbot

You can open the chatbot in several ways:

1. **Ribbon Icon**: Click the chat bubble icon in the left ribbon
2. **Command Palette**: 
   - Press `Ctrl/Cmd + P` to open command palette
   - Type "Open Document Chatbot" and press Enter

### Chatting with Documents

1. Open any document in Obsidian
2. Open the chatbot interface
3. Ask questions about the document content
4. The AI will respond based on the document's content

### Example Questions

- "What are the main points discussed in this document?"
- "Can you summarize this article?"
- "What does the author say about [specific topic]?"
- "Find any actionable items or tasks mentioned"
- "Explain the concept of [term] as described here"

## Models Available

- **deepseek-chat**: General-purpose conversational AI
- **deepseek-coder**: Optimized for code-related discussions

## Privacy & Data

- Your documents are sent to DeepSeek's API for processing
- Only the current document content is shared
- Chat history is kept locally and not stored permanently
- API key is stored locally in Obsidian's settings

## Troubleshooting

**"Please configure your DeepSeek API key"**
- Make sure you've entered a valid API key in the plugin settings

**"Please open a document first"**
- The chatbot needs an active document to work with
- Open any markdown file in Obsidian before starting the chat

**API Errors**
- Check that your API key is correct and has sufficient credits
- Ensure you have internet connectivity

## Development

To build this plugin:

```bash
npm install
npm run build
```

To run in development mode with auto-rebuild:

```bash
npm run dev
```

## Support

If you encounter any issues or have feature requests, please create an issue on the project repository.
