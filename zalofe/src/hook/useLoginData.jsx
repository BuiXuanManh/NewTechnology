import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import UserService from '../services/UserService';
let l = [];
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
    let service = new UserService();
    const list = useQuery({
        queryKey: ["friends"],
        queryFn: () => service.getFriends(token, "friend").then(res => {
            if (token) {
                console.log(token);
                // console.log("data", res.data);
                if (res?.data)
                    return res.data;
            }
        }),
        onError: (err) => {
            console.error("err", err);
        },
        enabled: token !== "" && token !== undefined && l.length === 0,
        // cacheTime: 3600000,
    })
    if (list?.data) {
        l = list?.data;
    }
    // console.log(l);
    return l;
}

export default useLoginData;
