import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RevokedToken extends Model {
    static associate(models) {
      RevokedToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  RevokedToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      tokenId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'RevokedToken',
      tableName: 'RevokedTokens',
      timestamps: true
    }
  );

  return RevokedToken;
};