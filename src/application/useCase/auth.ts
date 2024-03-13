import { inject, injectable } from 'inversify';
import User from '../../domain/entity/user';
import SessionService from '../../domain/service/session';

@injectable()
export default class Auth {
    constructor(@inject(SessionService) private readonly sessions: SessionService) {}

    async login(email: string, password: string) {
        try {
            const user = new User();
            await user.login(email, password);
            this.sessions.set(email, user);

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
