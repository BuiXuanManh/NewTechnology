import { over } from 'stompjs';
import SockJS from 'sockjs-client';
let stompClient = null;
const connect = (chat, message, setChats) => {
    const handleMessages = (payload) => {
        setChats(prevChats => [...prevChats, JSON.parse(payload.body)]);
    };
    let Sock = new SockJS('http://localhost:8080/api/ws');
    stompClient = over(Sock);
    const onConnected = () => {
        stompClient.subscribe(`/chatroom/${chat?.id}`, handleMessages);
        stompClient.send(`/app/chat/${chat?.id}`, {}, JSON.stringify(message));
    }
    stompClient.connect({}, onConnected, (error) => console.log(error));
}
export default connect;
