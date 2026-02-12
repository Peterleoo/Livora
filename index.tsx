import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 全局错误捕获，防止 PWA 静默白屏
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global Error:", message, "at", source, ":", lineno);
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled Rejection:", event.reason);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);