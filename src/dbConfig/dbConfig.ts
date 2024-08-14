import mongoose from "mongoose";

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", (error) => {
      console.log("MongoDB connected");
    });

    connection.on("error", (error) => {
      console.log(
        "MongoDB connection error, Please make sure  db is up and running",
        error
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something wen wrong in connecting DB");
    console.log(error);
  }
};

export default connect
