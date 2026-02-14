const fetch = require("node-fetch");

exports.generateMeetingInsights = async (transcript) => {
    try {
        console.log("🧠 Generating summary via Ollama...");

        const prompt = `
You are a meeting intelligence assistant.

From the transcript below, extract:

1. A concise summary
2. Action items list

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "actionItems": ["...", "..."]
}

Transcript:
${transcript}
`;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistral",
                prompt,
                stream: false,
            }),
        });

        const data = await response.json();

        const text = data.response;

        // 🔥 very important — parse safely
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Summary generation error:", error);
        throw error;
    }
};
