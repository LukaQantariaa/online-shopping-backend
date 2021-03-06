import { Model, DataTypes } from 'sequelize'

import { db } from '../../config/database'
import { Category } from '../../models/category/category.model'

export class SubCategory extends Model { 
  public id!: number;
  public name!: string
  //public category_id!: number
  public CategoryId!: number
  public is_active!: boolean

}

  SubCategory.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      // category_id: {
      //     type: new DataTypes.INTEGER,
      //     allowNull: false
      // },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    },
    {
      tableName: "sub-category",
      sequelize: db
    }
  );

  
  Category.hasMany(SubCategory)
  SubCategory.belongsTo(Category)

  SubCategory.sync({ force: false }).then(() => console.log('Sub-category table created'));