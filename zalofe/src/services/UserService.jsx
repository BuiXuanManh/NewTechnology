import api from "../api/api";
import AuthService from "./AuthService";

export default class UserService {
    addFriend(token, id) {
        return api.put(`/api/v1/users/profile/friends/${id}`, {}, AuthService(token));
    }
    findByPhone(phone, token) {
        return api.get(`/api/v1/users/profile/${phone}`, AuthService(token));
    }
    getFriends(token) {
        return api.get(`/api/v1/users/profile/friends?type=friend`, AuthService(token));
    }
    getFriendSent(token) {
        return api.get(`/api/v1/users/profile/friends?type=sent`, AuthService(token));
    }
    acceptFriend(token, id) {
        return api.put(`/api/v1/users/profile/friends/${id}/accept`, {}, AuthService(token));
    }
    declineFriend(token, id) {
        return api.put(`/api/v1/users/profile/friends/${id}/decline`, {}, AuthService(token));
    }

}