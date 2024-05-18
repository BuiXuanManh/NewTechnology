import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import UserService from '../services/UserService';
import { AppContext } from '../context/AppContext';
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
    const { setSent, setFriend } = useContext(AppContext);
    const list = useQuery({
        queryKey: ["friends"],
        queryFn: () => {
            if (token !== "" && token !== undefined) service.getFriends(token, "friend").then(res => {
                if (res?.data) {
                    // setL(res.data);
                    setFriend(res.data);
                    return res.data;
                }

            })
        },

        // cacheTime: 3600000,
    })
    const requests = useQuery({
        queryKey: ["sendRequest"],
        queryFn: () => {
            if (token !== "" && token !== undefined)
                service.getFriendSent(token).then(res => {
                    if (token) {
                        if (res?.data) {
                            // setRe(res.data);
                            setSent(res.data);
                            return res.data;
                        }
                    }
                })
        }, enabled: token !== "" && token !== undefined
        // cacheTime: 3600000,
    })
    // return { l, re };
}


export default useLoginData;
