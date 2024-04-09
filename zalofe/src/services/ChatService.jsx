import api from "../api/api";
import AuthService from "./AuthService";

export default class ChatService {
    getChats(token) {
        return api.get("/api/v1/users/profile/chats", AuthService(token));
    }
}