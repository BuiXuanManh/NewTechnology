/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
let stompClient = null;
function Connection() {
    const [user, setUser] = useState({
        username: '660a9faec04d0532fa8d34ab',
        connect: false,
    });
    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/api/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, (error) => console.log(error));
    }
    const onConnected = () => {
        stompClient.subscribe('/user/' + user.username + '/private', onMessageReceived);
    }
    const onMessageReceived = (payload) => {
        console.log(payload.body);
    }
    const sendMessage = () => {
        const data = {
            sender: "6602209387c1ef000f268f77",
            content: "Hello, I'm a message!"
        };
        stompClient.send("/app/chat/660a9faec04d0532fa8d34ab", {}, JSON.stringify(data));
    }
    connect();
    return <div> {

        sendMessage()
    }
    </div>
}

export default Connection;