import {injectable, inject} from 'inversify';
import * as express from 'express';

import {RegistrableController} from '../Registerable.controller';
import { CategoriesService } from '../../services/categories/categories.service'
import TYPES from '../../types/types'
import { Category } from '../../validators/category/category'

@injectable()
export class CategoriesController implements RegistrableController {

    private CategoriesService: CategoriesService;

    constructor(@inject(TYPES.CategoriesService) CategoriesService: CategoriesService) {
        this.CategoriesService = CategoriesService;
    }

    public register(app: express.Application): void {
        app.route('/categories')
            // GET all categories
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const Categories = await this.CategoriesService.getCategories().catch(err => {
                        throw({type: "Categories_Controller_ERROR", value: err, statusCode: 400})
                    });
                    res.send(Categories)
                } catch(err) {
                    next(err)
                }
            })
            // Create Category
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // request params
                    const request = {
                        name: req.body.name,
                        is_active: true
                    }

                    // validate
                    const validate = Category.validate(request)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({type: "CATEGORY_CONTROLLER_ERROR", value: err, statusCode: 400})
                    }

                    // register user
                    const createdCategory = await this.CategoriesService.createCategory(request)
                    res.send(createdCategory)
                } catch(err) {
                    next(err)
                }
            })
    }

}