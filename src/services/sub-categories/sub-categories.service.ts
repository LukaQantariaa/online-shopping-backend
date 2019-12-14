import 'reflect-metadata';
import {injectable, inject} from 'inversify';

import { SubCategoriesRepository } from '../../repository/sub-categories/sub-categories.repository'
import { CategoriesRepository } from '../../repository/categories/categories.repository'
import { SubCategory } from '../../models/sub-category/sub-category';
import { Category } from '../../models/category/category.model'
import TYPES from '../../types/types'


export interface SubCategoriesService {
    getSubCategories():  Promise<SubCategory[]>;
    createSubCategory(Subcategory: any): Promise<SubCategory>;
}

@injectable()
export class SubCategoriesServiceImp implements SubCategoriesService {

    private SubCategoriesRepository: SubCategoriesRepository;
    private CategoriesRepository: CategoriesRepository

    constructor(@inject(TYPES.SubCategoriesRepository) SubCategoriesRepository: SubCategoriesRepository, @inject(TYPES.CategoriesRepository) CategoriesRepository: CategoriesRepository) {
        this.SubCategoriesRepository = SubCategoriesRepository;
        this.CategoriesRepository = CategoriesRepository;
    }

    public async getSubCategories(): Promise<SubCategory[]> {
        const SubCategories: SubCategory[] = await this.SubCategoriesRepository.findAll().then((sub) => {
            return sub
        }).catch((err) => {
            throw({type: "SUB-CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return SubCategories;
    }

    public async createSubCategory(Subcategory: any): Promise<SubCategory> {
        // Check if Sub-Category already exists with this name
        const SubcategoryName: any = await this.SubCategoriesRepository.findOne({ name: Subcategory.name }).then((name) => {
            return name
        });
        if(SubcategoryName) {
            throw({type: "SUB-CATEGORY_SERVICE_ERROR", value: `name: ${Subcategory.name} already exists!`, statusCode: 400})
        }

        // Check if Category exists with this id.
        const category: Category = await this.CategoriesRepository.findOne({id: Subcategory.category_id}).then((c) => {
            return c
        });
        if(!category) {
            throw({type: "SUB-CATEGORY_SERVICE_ERROR", value: `Not found Category where id= ${Subcategory.category_id}!`, statusCode: 400})
        }

        // Create Sub-category
        const CreatedSubCategory:SubCategory = await this.SubCategoriesRepository.createOne(Subcategory).then((created: SubCategory) => {
            return created
        }).catch((err) => {
            throw({type: "SUB-CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return CreatedSubCategory
    }

}

