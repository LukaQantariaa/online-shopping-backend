import { Model, DataTypes } from 'sequelize'
import { db } from '../../config/database'

export class Category extends Model { 
  public id!: number;
  public name!: string
  public is_active!: boolean

}

  Category.init(
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
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    },
    {
      tableName: "category",
      sequelize: db
    }
  );

  Category.sync({ force: false }).then(() => console.log('Category table created'));