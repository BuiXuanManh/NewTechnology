export default class RegexService {
    constructor() {
        this.regex = {
            phone: /((09|03|07|08|05)+([0-9]{8})\b)/,
            email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?=\S+$).{8,32}$/,
            name: /^[a-zA-Z]{3,}$/,
            address: /^[a-zA-Z0-9]{3,}$/,
            number: /^[0-9]{1,}$/,
            date: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
            time: /^[0-9]{2}:[0-9]{2}$/,
            url: /^(http|https):\/\/[^ "]+$/,
            image: /\.(jpeg|jpg|gif|png)$/
        }
    }
}