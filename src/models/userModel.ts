import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/db";
import BookHistory from "./bookHistoryModel";
import Book from "./bookModel";
import Rating from "./ratingModel";

class User extends Model {
  public id!: number;
  public name!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

User.hasMany(BookHistory, {
  foreignKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BookHistory.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

User.hasMany(Rating, {
  foreignKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rating.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

export default User;
