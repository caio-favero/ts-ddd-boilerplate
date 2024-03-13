import { Router } from 'express';
import { inject, injectable } from 'inversify';
import AuthController from '../controller/auth';

@injectable()
export default class ExampleRouter {
    constructor(
        @inject(AuthController) private readonly authController: AuthController,
    ) {}

    async loadRouter() {
        const router = Router();
        router.post('/login', this.authController.login.bind(this.authController));

        return router;
    }
}
