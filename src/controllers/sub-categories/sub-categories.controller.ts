import {injectable, inject} from 'inversify';
import * as express from 'express';
import * as HttpStatus from "http-status-codes";

import {RegistrableController} from '../Registerable.controller';
import { SubCategoriesService } from '../../services/sub-categories/sub-categories.service'
import TYPES from '../../types/types'
import { SubCategory } from '../../validators/sub-category/sub-category'
import { ISubCategory } from '../../interfaces/sub-category/sub-category.interface'

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
                    const SubCategories = await this.SubCategoriesService.getSubCategories()
                    res.json(SubCategories).send()
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
                        CategoryId: req.body.CategoryId,
                        is_active: true
                    }

                    // validate
                    const validate = SubCategory.validate(request)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({value: err, statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Create Sub-Category
                    const createdSubCategory = await this.SubCategoriesService.createSubCategory(request)
                    res.json(createdSubCategory).send()
                } catch(err) {
                    next(err)
                }
            })
        app.route('/subcategories/:id')
            // GET all categories
            .delete(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const id:number = parseInt(req.params.id)
                    
                    // Check params
                    if(!id) {
                        throw({value: "Invalid request params", statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Delete subcategory
                    const deletedSubCategory = await this.SubCategoriesService.deleteSubCategory(id)
                    res.json(deletedSubCategory).send()
                } catch(err) {
                    next(err)
                }
            })
        app.route('/subcategories/:id')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const id:number = parseInt(req.params.id)

                    // Check params
                    if(!id) {
                        throw({value: "Invalid request params", statusCode: HttpStatus.BAD_REQUEST})
                    }

                    // Get subcategory
                    const Category: ISubCategory = await this.SubCategoriesService.getSubCategory(id)
                    res.json(Category).send()
                } catch(err) {
                    next(err)
            }
        })
            
    }

}