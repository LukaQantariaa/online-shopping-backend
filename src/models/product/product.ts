import { Model, DataTypes } from 'sequelize'
import { db } from '../../config/database'
import { User } from '../user/user.model';
import { SubCategory } from '../sub-category/sub-category';

export class Product extends Model { 
  public id!: number;
  //public subCategory_id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public location!: string;
  public image!: string;
  // public user_id!: number;
  public is_active!: boolean

}

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      // subCategory_id: {
      //   type: new DataTypes.INTEGER,
      //   allowNull: false
      // },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      description: {
        type: new DataTypes.STRING(),
        allowNull: false
      },
      price: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      location: {
        type: new DataTypes.STRING(64),
        allowNull: true
      },
      image: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      // user_id: {
      //   type: new DataTypes.INTEGER,
      //   allowNull: false
      // },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    },
    {
      tableName: "product",
      sequelize: db
    }
  );

  User.hasMany(Product)
  Product.belongsTo(User)

  SubCategory.hasMany(Product)
  Product.belongsTo(SubCategory)

  Product.sync({ force: false }).then(() => console.log('product table created'));