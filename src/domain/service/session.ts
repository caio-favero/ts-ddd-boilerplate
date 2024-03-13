import { injectable } from 'inversify';
import User from '../entity/user';

@injectable()
export default class SessionService {
    private sessions: { [key: string]: User } = {};

    set(key: string, session: User) {
        this.sessions[key] = session;
    }

    delete(key: string) {
        delete this.sessions[key];
    }

    get(key: string) {
        return this.sessions[key];
    }

    getAll() {
        return this.sessions;
    }
}
