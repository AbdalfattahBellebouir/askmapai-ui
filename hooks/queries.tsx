import { getAnswer } from "@/services/answer_service"
import { useMutation } from "@tanstack/react-query"


export const useAnswerLocations = () => {
    return useMutation({
        mutationKey: ['answerLocations'],
        mutationFn: ({ prompt, isDeepThinking }: { prompt: string; isDeepThinking: boolean }) =>
            getAnswer(prompt, isDeepThinking),
    })
}