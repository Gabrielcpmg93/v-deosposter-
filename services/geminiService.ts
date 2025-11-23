import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (ai) return ai;
  
  let apiKey = '';
  try {
      // Robustly check for process.env availability to avoid ReferenceErrors
      // @ts-ignore
      if (typeof process !== 'undefined' && process && process.env) {
          // @ts-ignore
          apiKey = process.env.API_KEY || '';
      }
  } catch (e) {
      console.warn("Could not access process.env", e);
  }
  
  if (!apiKey) {
      console.warn("API Key is missing for Gemini. AI features will be disabled.");
  }
  
  // Initialize with the key (or empty string if missing, handled by lib)
  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateAIComment = async (videoDescription: string, mood: string): Promise<string> => {
  try {
    const client = getAIClient();
    
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