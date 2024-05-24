import axios from 'axios';
export default axios.create({
    // baseURL: 'https://viet-chat-api-last.onrender.com'
    // baseURL: 'http://localhost:8080'
    baseURL: 'http://ec2-13-213-1-120.ap-southeast-1.compute.amazonaws.com:8080'
    // headers: { "ngrok-skip-browser-warning": "true" }
});