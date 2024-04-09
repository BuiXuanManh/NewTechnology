import api from "../api/api";
import AuthService from "./AuthService";

export default class OtpService {
    sendOtp(phone) {
        return api.post("/api/v1/auth/password/forgot", { phone: phone });
    }
    senOtpRegister(phone) {
        return api.post("/api/v1/verification/otp/sms/send", { phone: phone });
    }
    verifyOtpRegister(phone, otp) {
        return api.post("/api/v1/verification/otp/sms/validate", { phone: phone, otp: otp });
    }
    verifyOtp(phone, otp) {
        return api.post("/api/v1/auth/password/reset/validate", { phone: phone, otp: otp });
    }
    changPass(token, password) {
        return api.post("/api/v1/auth/password/reset", { token: token, password: password });
    }
}