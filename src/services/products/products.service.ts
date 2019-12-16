import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import {ProductsRepository} from '../../repository/products/products.repository';
import { Product } from '../../models/product/product'
import TYPES from '../../types/types';
import { IRegisterUser, ILoginUser } from '../../interfaces/user/user.interface'
import { generateToken } from '../../shared/helpers/jwt/generateToken'


export interface ProductsService {
    getProducts():  Promise<Product[]>;
}

@injectable()
export class ProductServiceImp implements ProductsService {

    private ProductsRepository: ProductsRepository

    constructor(@inject(TYPES.ProductsRepository) ProductsRepository: ProductsRepository) {
        this.ProductsRepository = ProductsRepository;
    }

    public async getProducts(): Promise<Product[]> {

        const Products: Product[] = await this.ProductsRepository.findAll().then((p) => {
            return p
        }).catch((err) => {
            throw({type: "PRODUCTS_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return Products;
    }


}