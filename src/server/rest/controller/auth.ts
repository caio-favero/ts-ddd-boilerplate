import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';

import AuthUseCase from '../../../application/useCase/auth';

@injectable()
export default class AuthController {
    constructor(@inject(AuthUseCase) private readonly auth: AuthUseCase) {}

    async login(request: Request, response: Response) {
        const { email, password } = request.body;
        console.log(request.body);

        const result = await this.auth.login(email, password);

        if (result) {
            return response.status(201).json({ message: 'logged!' });
        }

        return response.status(401).json({ error: 'unauthorized!' });
    }
}
