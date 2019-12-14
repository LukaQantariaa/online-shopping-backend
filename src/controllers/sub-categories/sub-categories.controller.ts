import {injectable, inject} from 'inversify';
import * as express from 'express';

import {RegistrableController} from '../Registerable.controller';
import { SubCategoriesService } from '../../services/sub-categories/sub-categories.service'
import TYPES from '../../types/types'
import { SubCategory } from '../../validators/sub-category/sub-category'

@injectable()
export class SubCategoriesController implements RegistrableController {

    private SubCategoriesService: SubCategoriesService;

    constructor(@inject(TYPES.SubCategoriesService) SubCategoriesService: SubCategoriesService) {
        this.SubCategoriesService = SubCategoriesService;
    }

    public register(app: express.Application): void {
        app.route('/subcategories')
            // GET all sub-categories
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const SubCategories = await this.SubCategoriesService.getSubCategories().catch(err => {
                        throw({type: "Sub-Categories_Controller_ERROR", value: err, statusCode: 400})
                    });
                    res.send(SubCategories)
                } catch(err) {
                    next(err)
                }
            })
            // Create Sub-Category
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // request params
                    const request = {
                        name: req.body.name,
                        category_id: req.body.categoryId,
                        is_active: true
                    }

                    // validate
                    const validate = SubCategory.validate(request)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({type: "SUB-CATEGORY_CONTROLLER_ERROR", value: err, statusCode: 400})
                    }

                    // Create Sub-Category
                    const createdSubCategory = await this.SubCategoriesService.createSubCategory(request)
                    res.send(createdSubCategory)
                } catch(err) {
                    next(err)
                }
            })
        app.route('/subcategories/:id')
            // GET all categories
            .delete(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const id:number = parseInt(req.params.id)
                    const deletedSubCategory = await this.SubCategoriesService.deleteCategory(id)
                    res.send(deletedSubCategory)
                } catch(err) {
                    next(err)
                }
            })
            
    }

}