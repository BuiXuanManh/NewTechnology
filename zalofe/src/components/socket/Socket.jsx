import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import AuthService from '../../services/AuthService';
let stompClient = null;
const connect = (chat, message, setChats, token) => {
    const handleMessages = (payload) => {
        console.log(payload.body);
        setChats(prevChats => [...prevChats, JSON.parse(payload.body)]);
    };
    // let Sock = new SockJS('http://localhost:8080/api/ws');
    let Sock = new SockJS('http://ec2-13-213-1-120.ap-southeast-1.compute.amazonaws.com:8080/api/ws');
    stompClient = over(Sock);
    const onConnected = () => {
        stompClient.subscribe(`/chatroom/${chat?.id}`, handleMessages);
        stompClient.send(`/app/chat/${chat?.id}`, {}, JSON.stringify(message));
    }
    stompClient.connect({ Authorization: `Bearer ${token}` }, onConnected, (error) => console.log(error));
}
export const disconnect = () => {
    if (stompClient) {
        stompClient.disconnect();
    }
}
export const listen = (chatId, setChats, setReaction, token) => {
    let Sock = new SockJS('http://ec2-13-213-1-120.ap-southeast-1.compute.amazonaws.com:8080/api/ws');
    // let Sock = new SockJS('http://localhost:8080/api/ws');
    stompClient = over(Sock);
    const onConnected = () => {
        const handleMessages = (payload) => {
            console.log("loaddddddddddddđ", JSON.parse(payload.body));
            const newChat = JSON.parse(payload.body);
            setReaction(react => [...react, newChat.reactions]);
            setChats(prevChats => {
                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex(chat => chat.id === newChat.id);
                if (chatIndex !== -1) {
                    // Update existing chat
                    updatedChats[chatIndex] = newChat;
                } else {
                    // Add new chat
                    updatedChats.push(newChat);
                }

                // Optional: Sort the chats if necessary
                // updatedChats.sort((a, b) => a.timestamp - b.timestamp);

                return updatedChats;
            });

        };
        stompClient.subscribe(`/chatroom/${chatId}`, handleMessages);
        stompClient.connect({ Authorization: `Bearer ${token}` }, onConnected, (error) => console.log(error));

        // stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(message));
    }
}
export default connect;
