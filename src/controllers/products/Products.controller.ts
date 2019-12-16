
import * as express from 'express';
import {injectable, inject} from 'inversify';
import { RegistrableController } from '../Registerable.controller'

import { ProductsService } from '../../services/products/products.service'
import TYPES from '../../types/types'

@injectable()
export class ProductsController implements RegistrableController {

    private ProductsService: ProductsService;

    constructor(@inject(TYPES.ProductsService) ProductsService: ProductsService) {
        this.ProductsService = ProductsService;
    }

    public register(app: express.Application): void {
        app.route('/products')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const Products = await this.ProductsService.getProducts().catch(err => {
                        throw({type: "PRODUCTS_Controller_ERROR", value: err, statusCode: 400})
                    });
                    res.send(Products)
                } catch(err) {
                    next(err)
                }
            })
    }

}