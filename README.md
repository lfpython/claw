# ClawWin

<div align="center">
  <img src="src/assets/logo.svg" width="120" height="120" alt="ClawWin Logo" />
  
  <h1>ClawWin</h1>
  <p><strong>基于 OpenClaw 的 Windows AI 桌面助手</strong></p>
  
  [![Release](https://img.shields.io/github/v/release/lfpython/claw?style=flat-square)](https://github.com/lfpython/claw/releases)
  [![License](https://img.shields.io/github/license/lfpython/claw?style=flat-square)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)](https://github.com/lfpython/claw/releases)
</div>

---

## 简介

ClawWin 是专为 Windows 平台优化的 [OpenClaw](https://github.com/OpenClaw-ai/openclaw) AI 桌面客户端，面向中国用户设计，优先支持国内主流 AI 大模型。

## 特性

- 🎯 **Windows 优先** - Fluent Design 风格，支持 Mica/Acrylic 效果
- 🇨🇳 **中文优先** - 界面默认中文，完整中英双语支持
- 🤖 **国内模型优先** - 内置智谱 GLM、DeepSeek、通义千问、MiniMax、Moonshot、硅基流动等
- 🌐 **多渠道** - 支持飞书、Telegram、Discord、微信等消息平台
- 🔄 **自动更新** - 基于 GitHub Releases 自动推送更新
- 🛡️ **安全存储** - API Key 使用系统密钥链加密保存
- 📋 **定时任务** - 支持 Cron 表达式定时执行 AI 任务
- 🔌 **技能扩展** - 模块化技能系统，轻松扩展功能

## 支持的 AI 模型

| 提供商 | 模型 | 需要代理 |
|--------|------|----------|
| 智谱 Z.AI | GLM-4, GLM-4-Flash | 否 |
| DeepSeek | DeepSeek-Chat, DeepSeek-Coder | 否 |
| 通义千问 | Qwen-Max, Qwen-Plus, Qwen-Turbo | 否 |
| MiniMax | abab6.5s-chat | 否 |
| Moonshot/Kimi | moonshot-v1-8k/32k/128k | 否 |
| 硅基流动 | 多种开源模型 | 否 |
| OpenAI | GPT-4o, GPT-4-Turbo | 是 |
| Anthropic | Claude 3.5 Sonnet | 是 |
| Google | Gemini 1.5 Pro | 是 |
| Ollama | 本地任意模型 | 否 |

## 安装

### 下载安装包

前往 [Releases 页面](https://github.com/lfpython/claw/releases) 下载最新安装包：

- `ClawWin-Setup-x.x.x-x64.exe` - 适用于 64 位 Windows
- `ClawWin-Setup-x.x.x-arm64.exe` - 适用于 ARM64 Windows

### 系统要求

- Windows 10 21H2 或更高版本（推荐 Windows 11）
- x64 或 ARM64 架构
- 4GB+ 内存

## 开发

### 环境要求

- Node.js 20+
- pnpm 或 npm

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/lfpython/claw.git
cd claw

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 打包

```bash
# 打包 Windows 安装包
npm run package:win
```

## 项目结构

```
clawwin/
├── electron/           # Electron 主进程
│   ├── main/          # 应用入口、窗口管理
│   ├── gateway/       # OpenClaw Gateway 连接
│   ├── preload/       # 安全 IPC 桥接
│   └── utils/         # 工具函数
├── src/               # React 渲染进程
│   ├── pages/         # 页面组件
│   ├── components/    # 通用组件
│   ├── stores/        # Zustand 状态
│   ├── i18n/          # 国际化翻译
│   └── types/         # TypeScript 类型
└── resources/         # 打包资源
    └── icons/         # 应用图标
```

## 技术栈

- **框架**: Electron 33 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **构建工具**: Vite + electron-builder
- **国际化**: i18next

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)

---

<div align="center">
  <sub>基于 <a href="https://github.com/ValueCell-ai/ClawX">ClawX</a> 架构构建 | 专为 Windows 用户优化</sub>
</div>
