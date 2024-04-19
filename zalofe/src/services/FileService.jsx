import api from "../api/api";
import AuthService from "./AuthService";

export default class FileService {
    file(token, data) {
        return api.post("/api/v1/files", data, AuthService(token));
    }
}