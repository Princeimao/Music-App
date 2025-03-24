import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("something went wrong while connecting to database ", error);
    process.exit(1);
  }
};
