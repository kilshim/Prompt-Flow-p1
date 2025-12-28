import { GoogleGenAI } from "@google/genai";

/**
 * Gemini API를 호출하여 프롬프트 결과를 생성합니다.
 * 배포 환경에서의 안전성을 위해 process.env 체크를 강화했습니다.
 */
export const runPrompt = async (prompt: string): Promise<string> => {
  try {
    // 1. sessionStorage 수동 키 확인 (사용자가 설정에서 입력한 키)
    const manualKey = sessionStorage.getItem('CUSTOM_GEMINI_API_KEY');
    
    // 2. 환경 변수 키 확인 (브라우저 심 처리됨)
    const envKey = typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
    
    const apiKey = manualKey || envKey;

    // 키가 아예 없거나 문자열 "undefined"로 들어온 경우 체크
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      throw new Error("Gemini API 키가 설정되지 않았습니다. 우측 상단 '환경 설정(톱니바퀴 아이콘)'에서 키를 입력해 주세요.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
    });
    
    return response.text || "결과를 생성할 수 없습니다.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const msg = error.message || "";
    // API 키 관련 일반적인 에러 대응 (401, 403 등)
    if (msg.includes("API_KEY") || msg.includes("403") || msg.includes("401") || msg.includes("not authorized") || msg.includes("entity was not found")) {
      return "유효하지 않은 API 키이거나 권한이 없습니다. 우측 상단 '환경 설정'에서 유효한 Gemini API 키를 다시 입력해 주세요. (Google AI Studio에서 무료로 발급 가능)";
    }
    
    return `프롬프트 생성 중 오류가 발생했습니다: ${error.message}`;
  }
};