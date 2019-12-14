import {injectable, inject} from 'inversify';
import * as express from 'express';

import {RegistrableController} from '../Registerable.controller';
import { SubCategoriesService } from '../../services/sub-categories/sub-categories.service'
import TYPES from '../../types/types'
import { Category } from '../../validators/category/category'

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
            });
            
    }

}