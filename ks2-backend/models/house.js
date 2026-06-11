import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class House extends Model {
    static associate(models) {
      House.belongsTo(models.User, {
        foreignKey: 'sellerId',
        as: 'seller'
      });
    }
  }

  House.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('available', 'sold'),
        allowNull: false,
        defaultValue: 'available'
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    },
    {
      sequelize,
      modelName: 'House',
      tableName: 'Houses',
      timestamps: true
    }
  );

  return House;
};
