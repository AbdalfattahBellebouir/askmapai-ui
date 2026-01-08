import { createHttpClient } from "@/lib/api/httpClient"
import { AskMapAIResponse } from "@/types/index"

const backend_api = createHttpClient(process.env.NEXT_PUBLIC_BACKEND_API || "")


export const getAnswer = async (prompt: string, isDeepThinking: boolean): Promise<AskMapAIResponse> => {

  return await backend_api.post<AskMapAIResponse>('/askmapai', {
        prompt,
        isDeepThinking
    })
}