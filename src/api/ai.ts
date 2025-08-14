import { $ajax, configType } from "@/request";
import { fetchEventSource, FetchEventSourceInit } from "@microsoft/fetch-event-source"
export type messagesType = {
    role: "system" | "user" | "assistant",
    content: string
}
export type roomType = {
    messages: messagesType[]
}
export const createChat = (data: messagesType[], config: FetchEventSourceInit = {}) => fetchEventSource(`${import.meta.env.VITE_BASE_URL}/ai/createChat`, {
    method: "POST",
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(data),
    ...config
})
