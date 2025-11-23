import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (ai) return ai;
  
  // Safe access to process.env to prevent ReferenceError in browser environments
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
  
  if (!apiKey) {
      console.warn("API Key is missing for Gemini");
  }
  
  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateAIComment = async (videoDescription: string, mood: string): Promise<string> => {
  try {
    const client = getAIClient();
    // Check if client actually has a key (internal check usually throws if empty, but we catch)
    
    const prompt = `You are a social media user watching a video with the description: "${videoDescription}". 
    Generate a short, engaging, and informal comment (max 15 words) that matches this mood: ${mood}. 
    Do not use hashtags. Just the text.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "This is awesome! 🔥";
  }
};

export const generateVideoCaption = async (imageBase64: string): Promise<string> => {
    try {
        const client = getAIClient();
        const response = await client.models.generateContent({
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