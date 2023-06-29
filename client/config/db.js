import colors from "colors";
import mongoose from "mongoose";

//morgan ke help se hamari api request console me dikhti hai
const uri =
  "mongodb+srv://Abhi:4qZQiHblDduGyuZo@cluster0.djbcc2z.mongodb.net/Ecommerce?retryWrites=true&w=majority";

//  Username : Abhi
//  password : 4qZQiHblDduGyuZo
export default async function connectionDB() {
  try {
    const con = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to mongodb ${con.Connection.host}`);
  } catch (error) {
    console.log(`Error in Mongodb${error}`.bgRed.white);
  }
}
