import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyDJqsYjUcuKh2y_2ZlTz1v-0TkBJKv3C-0";
const baseUrl = "https://my-openai-gemini-theta-teal.vercel.app";
console.log("Diag: Key is", apiKey.substring(0, 10) + "...", "Base URL:", baseUrl);

async function run() {
    try {
        console.log("Diag: Initializing GoogleGenAI...");
        const ai = new GoogleGenAI({ apiKey, httpOptions: { baseUrl } });

        console.log("Diag: Sending content request to gemini-2.0-flash...");
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: "Say 'Diagnostic Success'" }] }]
        });

        console.log("Diag: Response text:", response.text());
    } catch (err) {
        console.log("--- DIAGNOSTIC ERROR CATCHED ---");
        console.log("Name:", err.name);
        console.log("Message:", err.message);
        if (err.status) console.log("Status:", err.status);
        if (err.response) {
            console.log("HTTP Response Status:", err.response.status);
            // The response object might have been JSON-parsed already by the SDK
            console.log("Response Details:", JSON.stringify(err.response, null, 2));
        }
        if (err.stack) console.log("Stack Trace Snippet:", err.stack.split('\n').slice(0, 5).join('\n'));
    }
}

run();
