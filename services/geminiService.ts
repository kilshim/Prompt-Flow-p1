import { GoogleGenAI } from "@google/genai";

// Always create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
export const runPrompt = async (prompt: string): Promise<string> => {
  try {
    // sessionStorage에 저장된 수동 API 키 확인
    const manualKey = sessionStorage.getItem('CUSTOM_GEMINI_API_KEY');
    const apiKey = manualKey || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해 주세요.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
    });
    
    // The GenerateContentResponse object features a text property (not a method) that directly returns the string output.
    return response.text || "결과를 생성할 수 없습니다.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY") || error.message?.includes("entity was not found") || error.message?.includes("not authorized")) {
      return "API 키 설정에 문제가 있거나 권한이 없습니다. 설정에서 키를 확인하거나 다시 입력해 주세요.";
    }
    return `오류가 발생했습니다: ${error.message}`;
  }
};