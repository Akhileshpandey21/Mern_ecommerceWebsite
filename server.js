import express from "express";
// import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from 'cors'
import CategoryRoutes from './routes/CategoryRoutes.js'
import productRoutes from "./routes/productRoutes.js";

//rest object
const app = express();

//datasase config
connectionDB();

//middleware
app.use(cors());
app.use(express.json()); // inplace of bodyparser which help in send json data in request and response

app.use(morgan("dev"));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', CategoryRoutes);
app.use("/api/v1/product", productRoutes);



//configure env

dotenv.config(); // agr kisi object me hai to path object de skte hai {path:foldername}

//rest api
app.get("/", (req, res) => {
  res.send(
    "<h1>welcome to Ecommerce App created by Akhilesh kumar pandey</h1>"
  );
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

//express-formidable=for any file uploading 

