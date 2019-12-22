import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import * as HttpStatus from "http-status-codes";
import dotenv from 'dotenv'

import {ProductsRepository} from '../../repository/products/products.repository';
import { Product } from '../../models/product/product'
import TYPES from '../../types/types';
import { IProductCreate } from '../../interfaces/product/product.interface';
import { SubCategoriesRepository } from '../../repository/sub-categories/sub-categories.repository'
import { Files } from '../../shared/helpers/files/files'


export interface ProductsService {
    getProducts():  Promise<Product[]>;
    createProduct(product:IProductCreate, files: any): any //Promise<Product>
}

@injectable()
export class ProductServiceImp implements ProductsService {

    private ProductsRepository: ProductsRepository;
    private SubCategoriesRepository: SubCategoriesRepository;
    private Files: Files

    constructor(@inject(TYPES.ProductsRepository) ProductsRepository: ProductsRepository, @inject(TYPES.SubCategoriesRepository) SubCategoriesRepository: SubCategoriesRepository, @inject(TYPES.Files) Files: Files) {
        this.ProductsRepository = ProductsRepository;
        this.SubCategoriesRepository = SubCategoriesRepository;
        this.Files = Files
    }

    public async getProducts(): Promise<Product[]> {

        const Products: Product[] = await this.ProductsRepository.findAll().then((p) => {
            return p
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return Products;
    }

    public async createProduct(product:IProductCreate, files: any) {

        // Check if SubCategory exists
        const SubCategory = await this.SubCategoriesRepository.findOne({is_active: true, id: product.SubCategoryId}).then((c) => {
            return c
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        // If subCategiry not found
        if(SubCategory === null) {
            throw({value: `SubCategory not found on id: ${product.SubCategoryId}`, statusCode: HttpStatus.NOT_FOUND})
        }

        // Get last product id
        const lastProductId = await this.ProductsRepository.findLast().then((last) => {
            return last[0].id + +1
        })

        // Upload files.
        const file = await this.Files.uploadImages(files.image, `${process.env.LH_DIR}/${process.env.IMAGES_DIR}/${lastProductId}`).then((r: any) => {
            return r
        }).catch((err: any) => {
            throw(err)
        });

        // Add images directory url to product
        product['image'] = `${process.env.LH_DIR}/${process.env.IMAGES_DIR}/${lastProductId}`;

        // Create Product
        const CreatedProduct:Product = await this.ProductsRepository.createOne(product).then((created: Product) => {
            return created
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return CreatedProduct;
        
    }


}