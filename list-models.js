import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyDJqsYjUcuKh2y_2ZlTz1v-0TkBJKv3C-0";
const baseUrl = "https://my-openai-gemini-theta-teal.vercel.app";
const ai = new GoogleGenAI({ apiKey, httpOptions: { baseUrl } });

async function run() {
    try {
        console.log("Fetching models...");
        // Depending on the SDK version, it might be listModels() or similar.
        // For @google/genai v1.40.0+, let's try the generic approach.
        const response = await ai.models.list();
        console.log("Response structure:", JSON.stringify(Object.keys(response)));

        const models = response.models || response.pageInternal || [];
        if (models.length > 0) {
            console.log("Available Models:");
            models.map(m => m.name || m).sort().forEach(name => {
                if (typeof name === 'object') console.log(`- ${name.name}`);
                else console.log(`- ${name}`);
            });
        } else {
            console.log("No models found. Response keys:", Object.keys(response));
        }
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

run();
