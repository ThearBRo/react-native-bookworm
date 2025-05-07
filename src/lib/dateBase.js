import mongoose from "mongoose";

export const connectDateBase = async () => {
  await mongoose
    .connect(process.env.MONGO_URI) // connect to out data mongo
    .then((conn) => console.log(`Database connected ${conn.connection.host}`)) // Show in Server Database had connected
    .catch((err) => {
      console.log(`Error connecting to databse ${err}`);
      process.exist(1); // Intervalid Error Exist
    });
};
