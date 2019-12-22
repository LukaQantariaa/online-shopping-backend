
import * as express from 'express';
import {injectable, inject} from 'inversify';
import * as HttpStatus from "http-status-codes";

import { RegistrableController } from '../Registerable.controller'
import { ProductsService } from '../../services/products/products.service'
import TYPES from '../../types/types'
import { ProductSchema } from '../../validators/product/product'
import { verifyToken } from '../../shared/helpers/jwt/verifyToken'

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
                    const Products = await this.ProductsService.getProducts()
                    res.json(Products).send()
                } catch(err) {
                    next(err)
                }
            })
            // Create Product
            .post(verifyToken, async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // request params
                    const request = {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        location: req.body.location,
                        SubCategoryId: req.body.SubCategoryId,
                        UserId: req.body.userId,
                        is_active: true
                    }

                    // Validate
                    const validate = ProductSchema.validate(request)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({value: err, statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Check If product image exists
                    if(req.files === null) {
                        throw({value: "Product image is requeired", statusCode: HttpStatus.BAD_REQUEST})
                    }

                    const createdProduct = await this.ProductsService.createProduct(request, req.files)
                    res.json(createdProduct).send()

                } catch(err) {
                    next(err)
                }
            })
            
    }

}