import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const useTabs = ({ chat, setChatSelectId }) => {
    const [chats, setChats] = useState([]);
    const [selectedId, setSelectedId] = useState(Cookies.get("chatId") || null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchChatsFromCookies = () => {
            const storedChats = Cookies.get("chats");
            if (storedChats) {
                setChats(JSON.parse(storedChats));
            }
        };
        fetchChatsFromCookies();
    }, [Cookies.get("chats")]);
    useEffect(() => {
        const handleSelectedChat = () => {
            if (chats.length > 0) {
                const chat = chats.find((c) => c.id === selectedId);
                if (chat) {
                    setChatSelectId(chat);
                    Cookies.set("chat", JSON.stringify(chat));
                    queryClient.invalidateQueries(["chat"]);
                } else {
                    console.warn(`Chat with ID ${selectedId} not found in local data.`);
                    if (chats.length > 0) {
                        setSelectedId(chats[0].id);
                        Cookies.set("chatId", chats[0].id);
                        Cookies.set("chat", JSON.stringify(chats[0]));
                    }
                }
            }
        };

        handleSelectedChat();
    }, [chats, selectedId, setChatSelectId, queryClient]);

    const handleOnClick = (id) => {
        if (id) {
            const chat = chats.find((chat) => chat.id === id);
            if (chat) {
                setSelectedId(id);
                Cookies.set("chatId", id);
                Cookies.set("chat", JSON.stringify(chat));
                queryClient.invalidateQueries(["chat"]);
            }
        }
    };

    return {
        selectedId,
        handleOnClick,
    };
};

export default useTabs;
