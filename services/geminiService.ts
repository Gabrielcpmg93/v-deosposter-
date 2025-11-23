import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIComment = async (videoDescription: string, mood: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini");
    return "Wow, this is cool! (AI Unavailable)";
  }

  try {
    const prompt = `You are a social media user watching a video with the description: "${videoDescription}". 
    Generate a short, engaging, and informal comment (max 15 words) that matches this mood: ${mood}. 
    Do not use hashtags. Just the text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "This is awesome!";
  }
};

export const generateVideoCaption = async (imageBase64: string): Promise<string> => {
    if (!apiKey) return "Check out my new video! #viral";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: imageBase64
                        }
                    },
                    {
                        text: "Generate a catchy, short social media caption for this video frame with 3 trending hashtags."
                    }
                ]
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini Caption Error", error);
        return "New upload! #video #trending";
    }
}