import {injectable} from 'inversify';

import { Product } from '../../models/product/product'


export interface ProductsRepository {
    findAll(where?: {}): Promise<Product[]>;
}

@injectable()
export class ProductsRepositoryImp implements ProductsRepository {
    public findAll(where = {}): Promise<Product[]> {
        return Product.findAll({where: where});
    }

}