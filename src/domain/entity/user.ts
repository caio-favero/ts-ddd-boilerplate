export default class User {
    connected: boolean;

    constructor() {
        this.connected = false;
    }

    async login(email: string, password: string) {
        console.log(email, password);
        this.connected = true;
    }
}
