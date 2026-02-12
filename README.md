# 智寓 Livora - 下一代 AI 驱动的租房体验平台

![App Icon](./public/pwa-192x192.png)

**智寓 Livora** 是一个重塑城市居住体验的现代化租房平台。我们利用 Google Gemini AI 技术，结合沉浸式 VR 看房与全流程在线服务，为年轻一代提供“所见即所得”的极致租房体验。

## ✨ 核心特性

*   **🤖 AI 智能顾问 (Gemini 驱动)**
    *   **自然语言找房**：支持复杂的模糊指令（如“帮我找南山科技园附近，30分钟通勤，预算8000以内的两房”）。
    *   **上下文记忆**：支持多轮对话，AI 能记住您浏览过的房源，轻松回答“第一套房源怎么样？”等问题。
    *   **智能推荐**：对话中直接生成房源卡片，点击即可查看详情或发起签约。
*   **👓 沉浸式体验**
    *   **VR 全景看房**：集成 360° 全景浏览功能，支持热点交互与场景切换。
    *   **极致 UI/UX**：采用现代化的玻璃拟态设计（Glassmorphism），结合 Framer Motion 打造流畅的交互动画。
*   **📝 全流程在线服务**
    *   **在线签约**：从意向确认到电子合同签署的全链路数字化流程。
    *   **管家服务**：集成账单管理、租约管理与生活服务，让租后生活更轻松。
*   **📱 多端适配 (PWA)**
    *   响应式设计，完美适配桌面与移动端。
    *   支持 **PWA (Progressive Web App)**，可安装至手机主屏幕，提供原生 App 般的沉浸体验。

## 🛠️ 技术栈

*   **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **AI Integration**: [Google Gemini API](https://ai.google.dev/) (Gemini 2.0 Flash / Pro)
*   **Icons**: Google Material Symbols

## 🚀 快速开始 (Getting Started)

### 1. 克隆项目

```bash
git clone https://github.com/Peterleoo/Livora.git
cd Livora
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境

在项目根目录创建 `.env.local` 文件：

```env
# 必填：Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 选填：自定义 API 代理地址 (解决国内访问问题)
# VITE_API_BASE_URL=https://your-proxy-url.com
```

### 4. 启动开发环境

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可。

## 📂 核心目录结构

```
src/
├── components/       # 通用组件 (Icon, AIVisualization, etc.)
├── screens/          # 页面级组件
│   ├── HomeScreen.tsx    # 核心首页 (聊天与推荐)
│   ├── VRViewScreen.tsx  # VR 看房播放器
│   ├── SigningFlow.tsx   # 在线签约流程
│   └── ...
├── types.ts          # TypeScript 类型定义
├── App.tsx           # 应用入口与路由状态管理
├── main.tsx          # 渲染入口
└── index.css         # 全局样式与 Tailwind 配置
```

## 🔮 规划中特性 (Roadmap)

*   [ ] **地图找房**：集成高德/百度地图 API，实现地图圈选找房。
*   [ ] **真·支付**：接入微信/支付宝支付能力。
*   [ ] **房东端**：提供房源发布与租客管理后台。
*   [ ] **社区圈子**：租客社交与经验分享板块。

---

*Designed & Developed by Peterleo with AI Assistance.*
