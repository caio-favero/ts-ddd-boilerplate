import 'reflect-metadata';

import { Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export default abstract class IRouter {
    abstract loadRouter(): Promise<Router>;
}
