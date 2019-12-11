import { Model, DataTypes } from 'sequelize'
import { db } from '../../config/database'

export class User extends Model { }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    },
    {
      tableName: "users",
      sequelize: db
    }
  );

  User.sync({ force: false }).then(() => console.log('Users table created'));