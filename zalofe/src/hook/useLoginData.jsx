import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useLoginData = ({ token, setToken, setProfile, setPhone }) => {
    useEffect(() => {
        const loginData = () => {
            const t = Cookies.get("token");
            const p = Cookies.get("profile");
            const u = Cookies.get("phone");
            if (t && p && u) {
                setToken(t);
                setProfile(JSON.parse(p));
                setPhone(u);
            }
        }
        loginData();
    }, [token, Cookies.get("token")]);
}

export default useLoginData;
