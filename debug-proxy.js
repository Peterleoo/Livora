// Node 22 has built-in fetch

const API_KEY = "AIzaSyDJqsYjUcuKh2y_2ZlTz1v-0TkBJKv3C-0";
const PROXY_URL = "https://my-openai-gemini-theta-teal.vercel.app";

async function testProxy() {
    console.log("--- 诊断中转服务器 ---");

    const paths = [
        "/v1beta/models/gemini-2.0-flash:generateContent",
        "/models/gemini-2.0-flash:generateContent",
        "/v1/chat/completions" // OpenAI 格式
    ];

    for (const path of paths) {
        try {
            console.log(`\n测试路径: ${path}`);
            const res = await fetch(`${PROXY_URL}${path}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hi" }] }]
                })
            });
            console.log(`状态码: ${res.status}`);
            if (res.status === 200) {
                console.log("✅ 此路径有效!");
            }
        } catch (e) {
            console.log(`❌ 请求失败: ${e.message}`);
        }
    }
}

testProxy();
