import api from "../api/api";
import AuthService from "./AuthService";

export default class ChatService {
    getChats(token) {
        return api.get("/api/v1/users/profile/chats", AuthService(token));
    }
    getMessages(token, id) {
        return api.get(`/api/v1/chats/${id}/messages`, AuthService(token));
    }
    chat(token, chatId, content) {
        return api.post(`/api/v1/chats/${chatId}/messages`, content, AuthService(token));
    }
    unsend(chatId, messageID, token) {
        return api.put(`/api/v1/chats/${chatId}/messages/${messageID}`, {}, AuthService(token));
    }
    delete(chatId, messageID, token) {
        return api.delete(`/api/v1/chats/${chatId}/messages/${messageID}`, AuthService(token));
    }
    reaction(chatId, messageID, reaction, token) {
        return api.put(`/api/v1/chats/${chatId}/messages/${messageID}/reaction`, reaction, AuthService(token));
    }
}