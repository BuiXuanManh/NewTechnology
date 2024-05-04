import React, { createContext, useState } from 'react';
export const AppContext = createContext();
const AppProvider = ({ children }) => {
    const [chat, setChat] = useState({});
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    return (
        <AppContext.Provider value={{ chat, setChat, chats, setChats, messages, setMessages, chatId, setChatId  }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;