# 🦅 EagleEye - Supply Chain Security Scanner

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)

**EagleEye** is an advanced security tool that scans GitHub repositories and npm packages to detect vulnerabilities, malicious code, hidden characters, and developer risks before you integrate them into your project.

## ✨ Features
- 🔍 Real-time scanning of GitHub repos & npm packages
- 📦 Full dependency tree analysis
- 🛡️ CVE lookup via NVD API
- 👥 Developer risk profiling (suspicious emails)
- 👁️ Invisible character detection (zero-width, etc.)
- 🧪 Safe behavioral analysis using `isolated-vm` sandbox
- 📄 PDF report generation
- 🌐 Multilingual UI (English, Français, العربية)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/yourusername/eagleeye.git
cd eagleeye
npm install
cp .env.example .env   # Add your API keys (optional)
npm start
```

Then open `http://localhost:3000`

### Environment Variables (optional)
| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Increases GitHub API rate limit |
| `NVD_API_KEY`  | For NVD API (faster) |
| `PORT`         | Default 3000 |

## ⚠️ Security & Sandboxing
The tool uses `isolated-vm` for secure code analysis. The legacy `vm2` is deprecated due to sandbox escape vulnerabilities. For production environments, consider using Docker containers for full isolation.

## 📸 Demo
![EagleEye Demo](demo.gif)

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss changes.

## 📜 License
MIT © 2025

## 🌍 Languages
- English (primary)
- French
- Arabic
