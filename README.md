# FluxEz - Free AI Image Generation Tool

![FluxEz Interface](./public/images/Flux-demo.png)

A Next.js-based website for Flux.1-dev model image generation, powered by [ComfyUI API](https://github.com/SaladTechnologies/comfyui-api) backend.

## ✨ Key Features

- ⚡ **10s Generation** - 4090 GPU accelerated
- 🎨 **Flux.1-dev Model** - Superior image quality
- 🛠️ **Customizable** - Multiple generation parameters
- 🆓 **100% Free** - No limits or hidden costs
- 🔌 **Zero Configuration** - No login required

## 🚀 Quick Start

1. Visit [FluxEz Live Demo](https://flux.comnergy.com/zh)
2. Enter your prompt (English recommended)
3. Click "Generate" and wait ~10s

## 🖼️ Gallery

![](./public/images/demo-1.jpg)
![](./public/images/demo-2.jpg)

## 🛠️ Development

### Project Structure
fluxez/  
├── src/  
│ ├── app/ # Next.js core  
│ │ └── generate/  
│ │ └── route.ts # API endpoint handler  
├── public/ # Static assets  
└── package.json # Dependencies  


### Local Setup

```bash
git clone https://github.com/your-repo/fluxez.git
cd fluxez
npm install
npm run dev
Access http://localhost:3000 after starting

Backend Configuration
The ComfyUI API endpoint is hardcoded in:

typescript
// src/app/generate/route.ts
const COMFYUI_API_URL = "https://lastapi-light1-last.550w.run"  // Modify here if needed
```
## 🤝 Contributing
We welcome:

Feature requests (via Issues)

Code contributions (via PRs)

📜 License
MIT Licensed | © 2023 FluxEz Project

Live Demo ➡️ [FluxEz Website](https://flux.comnergy.com/zh)