# Dreamify -基于comfyui和Next.js的Flux AI图像生成网站应用
一个基于Next.js和comfyui的AI图像生成网站应用，后端图像生成采用[ComfyUI API](https://github.com/SaladTechnologies/comfyui-api) 驱动。
![FluxEz界面](./public/images/Flux-demo.png)
## ✨ 核心特色
- 生成计时 - 页面展示生图等待时间

- 多种模型 - 基于需求可任意替换

- 高度可定制 - 支持多参数调节

- 自动重试 - 当一个生图请求失效时，自动向后端发送新的请求

- 开箱即用 - 无需登录配置

## 🚀 快速开始
[访问在线演示站](https://dreamify.slmnb.cn/zh)

## ⚠️ 重要提示
- 这是一个用于AI文生图网站的前端项目，但并不包含图像生成的能力哦！如果你想要运行这个项目，请记得自己部署一个文生图的后端服务基于 [ComfyUI API](https://github.com/SaladTechnologies/comfyui-api)。对于生产环境，我们推荐您使用[共绩算力](https://gongjiyun.com)作为项目的云算力平台，因其已提供了预制的ComfyUI-API镜像。但项目本身并不绑定任何云平台，您也可以考虑任何其他平台（例如阿里云、AutoDL等）
## ⚙️项目架构图
![](./public/images/flux-structure.png)

## 🖼️ 网站部分页面展示
![](./public/images/demo-1.jpg)
![](./public/images/demo-2.jpg)

## 🛠️ 开发指南

### 本地部署
```bash
git clone https://github.com/your-repo/fluxez.git
cd fluxez
npm install
npm run dev
# 启动后访问 http://localhost:3000
```
#### API配置
ComfyUI API端点配置在`.env`文件中,你需要将一个可访问的ComfyUI API服务的URL进行配置，如下。
```
COMFYUI_API_URL = "https://your-comfyui-api-url"
```
## 🐋 comfyui-api的Docker镜像构建（包含Flux模型的ComfyUI-api）
将Flux模型打包为ComfyUI的Docker镜像，并使用[ComfyUI API](https://github.com/SaladTechnologies/comfyui-api)进行封装。

### 先决条件
已安装Docker或docker desktop（windows）

### 构建流程
准备目录结构：
```
comfyUI/
└── Dockerfile
├── diffusion_models/
│   └── flux1-schnell.safetensors
├── text_encoders/
│   ├── clip_l.safetensors
│   └── t5xxl_fp8_e4m3fn.safetensors
├── vae/
│   └── ae.safetensors
```
使用Dockerfile：

```dockerfile
FROM ghcr.io/saladtechnologies/comfyui-api:comfy0.3.29-api1.8.3-torch2.6.0-cuda12.4-runtime

# 设置环境变量
ENV COMFYUI_PORT=8188 \
    MODEL_DIR=/opt/ComfyUI/models \
    BASE=""

# 4. 预创建模型目录结构
RUN mkdir -p ${MODEL_DIR}/{loras,vaes,text_encoders,diffusion_models}

# 5. 复制模型文件（
COPY diffusion_models/*.safetensors ${MODEL_DIR}/diffusion_models/
COPY vae/*.safetensors ${MODEL_DIR}/vae/
COPY text_encoders/*.safetensors ${MODEL_DIR}/text_encoders/

# 6. 暴露端口
EXPOSE ${COMFYUI_PORT}
```

接下来可自行构建镜像。
## 🤝 参与贡献
欢迎：

- 通过Issues提交功能建议

- 通过PR提交代码改进

## 📜 许可协议
[MIT许可证](./license.md) | © 2023 FluxEz项目

## 立即体验 
➡️ [FluxEz官网](https://flux.comnergy.com/zh)