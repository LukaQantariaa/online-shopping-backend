
import * as express from 'express';
import {injectable, inject} from 'inversify';
import { RegistrableController } from '../Registerable.controller'

@injectable()
export class ProductsController implements RegistrableController {
    public register(app: express.Application): void {
        app.route('/products')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.send('products')
            })
    }

}