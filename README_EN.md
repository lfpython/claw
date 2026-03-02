# ClawWin

<div align="center">
  <img src="src/assets/logo.svg" width="120" height="120" alt="ClawWin Logo" />
  
  <h1>ClawWin</h1>
  <p><strong>Windows AI Desktop Assistant powered by OpenClaw</strong></p>
  
  [![Release](https://img.shields.io/github/v/release/lfpython/claw?style=flat-square)](https://github.com/lfpython/claw/releases)
  [![License](https://img.shields.io/github/license/lfpython/claw?style=flat-square)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)](https://github.com/lfpython/claw/releases)
</div>

---

## Overview

ClawWin is a Windows-first desktop client for [OpenClaw](https://github.com/OpenClaw-ai/openclaw), designed for Chinese users with priority support for domestic AI models.

## Features

- 🎯 **Windows First** - Fluent Design style with Mica/Acrylic effects
- 🇨🇳 **Chinese First** - Default Chinese interface with full bilingual support
- 🤖 **Domestic AI Priority** - Built-in support for Zhipu GLM, DeepSeek, Qwen, MiniMax, Moonshot, SiliconFlow
- 🌐 **Multi-Channel** - Feishu, Telegram, Discord, WeChat and more
- 🔄 **Auto Update** - GitHub Releases based automatic updates
- 🛡️ **Secure Storage** - API Keys encrypted with system keychain
- 📋 **Cron Tasks** - Schedule AI tasks with cron expressions
- 🔌 **Skills** - Modular skill system for easy extension

## Supported AI Models

| Provider | Models | Proxy Required |
|----------|--------|----------------|
| Zhipu Z.AI | GLM-4, GLM-4-Flash | No |
| DeepSeek | DeepSeek-Chat, DeepSeek-Coder | No |
| Qwen (Alibaba) | Qwen-Max, Qwen-Plus | No |
| MiniMax | abab6.5s-chat | No |
| Moonshot/Kimi | moonshot-v1-8k/32k/128k | No |
| SiliconFlow | Multiple open-source models | No |
| OpenAI | GPT-4o, GPT-4-Turbo | Yes |
| Anthropic | Claude 3.5 Sonnet | Yes |
| Google | Gemini 1.5 Pro | Yes |
| Ollama | Any local model | No |

## Installation

### Download

Visit [Releases](https://github.com/lfpython/claw/releases) for the latest installer:

- `ClawWin-Setup-x.x.x-x64.exe` - 64-bit Windows
- `ClawWin-Setup-x.x.x-arm64.exe` - ARM64 Windows

### Requirements

- Windows 10 21H2 or later (Windows 11 recommended)
- x64 or ARM64 architecture
- 4GB+ RAM

## Development

```bash
git clone https://github.com/lfpython/claw.git
cd claw
npm install
npm run dev
```

## License

[MIT License](LICENSE)
