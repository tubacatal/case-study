import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/db";
import User from "./userModel";

// Define the BorrowedBook model
class BookHistory extends Model {
  public id!: number;
  public user_id!: number;
  public book_id!: number;
  public borrow_date!: Date;
  public return_date: Date | null;
  public book_status!: "borrowed" | "returned";
}

BookHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BookHistory",
    tableName: "book_histories",
    timestamps: false,
  }
);

export default BookHistory;
