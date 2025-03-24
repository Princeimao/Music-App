import "dotenv/config";
import { app } from "./app";
import { dbConnection } from "./src/config/db.connection";

const connection = async () => {
  try {
    await dbConnection();
    app.listen(process.env.PORT, () => {
      console.log(
        "App is running on port: " + `http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log("something went wrong while connection to app ", error);
    process.exit(1);
  }
};

connection();
