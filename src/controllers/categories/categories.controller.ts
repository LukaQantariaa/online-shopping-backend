import {injectable, inject} from 'inversify';
import * as express from 'express';
import * as HttpStatus from "http-status-codes";

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
                    const Categories = await this.CategoriesService.getCategories()
                    res.json(Categories).send()
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
                        throw({value: err, statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Create Category
                    const createdCategory = await this.CategoriesService.createCategory(request)
                    res.json(createdCategory).send()
                } catch(err) {
                    next(err)
                }
            })
        app.route('/categories/:id')
            // Delete Category
            .delete(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const id:number = parseInt(req.params.id)

                    // Check params
                    if(!id) {
                        throw({value: "Invalid request params", statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Delete Category
                    const deletedCategory = await this.CategoriesService.deleteCategory(id)
                    res.json(deletedCategory).send()
                } catch(err) {
                    next(err)
                }
            })
    }

}