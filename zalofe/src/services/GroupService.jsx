import api from "../api/api";
import AuthService from "./AuthService";

export default class GroupService {
    createGroup(token, data) {
        return api.post("/api/v1/groups", data, AuthService(token));
    }
    getMembers(token, id) {
        return api.get(`/api/v1/groups/${id}/members`, AuthService(token));
    }
    addMembers(token, id, data) {
        return api.put(`/api/v1/groups/${id}/members`, data, AuthService(token));
    }
    getGroups(token, id) {
        return api.get(`/api/v1/groups/${id}`, AuthService(token));
    }
    delete(token, id, member_id) {
        return api.delete(`/api/v1/groups/${id}/members/${member_id}`, AuthService(token));
    }
    deleteGroup(token, id) {
        return api.delete(`/api/v1/groups/${id}`, AuthService(token));
    }

}