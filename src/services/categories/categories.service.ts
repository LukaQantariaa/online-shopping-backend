import 'reflect-metadata';
import {injectable, inject} from 'inversify';

import { CategoriesRepository } from '../../repository/categories/categories.repository'
import { Category } from '../../models/category/category.model'
import { ICategory } from '../../interfaces/category/category.interface'
import TYPES from '../../types/types'


export interface CategoriesService {
    getCategories():  Promise<Category[]>;
    createCategory(category: ICategory): Promise<Category>
}

@injectable()
export class CategoriesServiceImp implements CategoriesService {

    private CategoriesRepository: CategoriesRepository

    constructor(@inject(TYPES.CategoriesRepository) CategoriesRepository: CategoriesRepository) {
        this.CategoriesRepository = CategoriesRepository;
    }

    public async getCategories(): Promise<Category[]> {
        const Categories: Category[] = await this.CategoriesRepository.findAll().then((Categories) => {
            return Categories
        }).catch((err) => {
            throw({type: "CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return Categories;
    }

    public async createCategory(category: ICategory): Promise<Category> {
        // Check if Category already exists with this username
        const categoryName: any = await this.CategoriesRepository.findOne({ name: category.name }).then((categoryName) => {
            return categoryName
        });
        if(categoryName) {
            throw({type: "CATEGORY_SERVICE_ERROR", value: `name: ${category.name} already exists!`, statusCode: 400})
        }

        // register User
        const CreatedCategory:Category = await this.CategoriesRepository.createOne(category).then((category: Category) => {
            return category
        }).catch((err) => {
            throw({type: "CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return CreatedCategory
    }
}

