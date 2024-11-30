import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/db";
import BookHistory from "./bookHistoryModel";
import Rating from "./ratingModel";

class Book extends Model {
  public id!: number;
  public name!: string;
}

Book.init(
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
    modelName: "Book",
    tableName: "books",
    timestamps: true,
  }
);

Book.hasMany(BookHistory, {
  foreignKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BookHistory.belongsTo(Book, { foreignKey: "book_id", targetKey: "id" });

Book.hasMany(Rating, {
  foreignKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rating.belongsTo(Book, { foreignKey: "book_id", targetKey: "id" });

export default Book;
