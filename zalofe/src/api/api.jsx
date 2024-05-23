import axios from 'axios';
export default axios.create({
    // baseURL: 'https://viet-chat-api-last.onrender.com'
    baseURL: 'http://localhost:8080'
    // headers: { "ngrok-skip-browser-warning": "true" }
});