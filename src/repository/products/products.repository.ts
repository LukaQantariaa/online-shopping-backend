import {injectable} from 'inversify';

import { Product } from '../../models/product/product'
import { User } from '../../models/user/user.model';
import { SubCategory } from '../../models/sub-category/sub-category';
import { IProductCreate } from '../../interfaces/product/product.interface';


export interface ProductsRepository {
    findAll(where?: {}): Promise<Product[]>;
    findLast(where?: {}): Promise<Product[]>;
    createOne(product: IProductCreate): Promise<Product>;
}

@injectable()
export class ProductsRepositoryImp implements ProductsRepository {
    public async findAll(where = {}): Promise<Product[]> {
        return Product.findAll({where: where, include: [{model: User, where: {is_active: true}},{model: SubCategory, where: {is_active: true}}]})
    }

    public async findLast(where?: {}): Promise<Product[]> {
        return Product.findAll({limit:1, where:where, order: [ [ 'createdAt', 'DESC' ]]})
    }

    public async createOne(product: IProductCreate): Promise<Product> {
        return Product.create(product)
    }

}