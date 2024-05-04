import { useState, useEffect, useMemo, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AppContext } from "../context/AppContext";

const useTabs = () => {
    const { chat, setChat, chats, setChats, chatId, setChatId, messages, setMessages } = useContext(AppContext);
    const queryClient = useQueryClient();
    // useEffect(() => {
    // const fetchChatsFromCookies = () => {
    //     const storedChats = Cookies.get("chats");
    //     if (storedChats) {
    //         setChats(JSON.parse(storedChats));
    //     }
    // };
    // fetchChatsFromCookies();
    // },);
    useEffect(() => {
        const handleSelectedChat = () => {
            if (chats.length > 0) {
                const chat = chats.find((c) => c.id === chatId);
                if (chat) {
                    setChatId(chat.id);
                    // console.log(chat)
                    // Cookies.set("chat", JSON.stringify(chat));
                    // queryClient.invalidateQueries(["chat"]);
                } else {
                    console.warn(`Chat with ID ${chatId} not found in local data.`);
                    if (chats.length > 0) {
                        setChatId(chats[0].id);
                        console.log("chats", chats[0])
                        // Cookies.set("chatId", chats[0].id);
                        // Cookies.set("chat", JSON.stringify(chats[0]));
                        setChatId(chats[0].id);
                        setChat(chats[0]);
                    }
                }
            }
        };
        handleSelectedChat();
    }, [chats, chatId]);

    const handleOnClick = (id) => {
        if (id) {
            const chat = chats.find((chat) => chat.id === id);
            if (chat) {
                setChatId(id);
                console.log(id)
                // Cookies.set("chatId", id);
                // Cookies.set("chat", JSON.stringify(chat));
                setChat(chat);
                // setChatId(id);
            }
        }
    };

    return {
        chatId,
        handleOnClick,
    };
};

export default useTabs;
