import api from "../api/api";
import AuthService from "./AuthService";

export default class LoginService {
    login(data) {
        return api.post("/api/v1/auth/login", data);
    }
    getUser(token) {
        return api.get("/api/v1/users/profile", AuthService(token));
    }
}