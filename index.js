import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors"; 
import morgan from "morgan"; 
import userRouter from "./src/routes/Auth/AuthRouter.js";
import AdminRouter from "./src/routes/Admin/adminRouter.js";




dotenv.config();

const app = express();

connectDb();

app.use(express.json());


app.use(cors());
app.use(morgan('dev'));

app.use("/api/v1/", express.static("public/upload"));



app.use("/api/v1", userRouter)
app.use("/api/v1", AdminRouter)
// app.use("/api/v1", flashcardCategoryRouter)
// app.use("/api/v1", lessonRouter)
// app.use("/api/v1", AdminRouter)
// app.use("/api/v1", blogRouter)
// app.use("/api/v1", flashRouter)
// app.use("/api/v1", quizRouter)
// app.use("/api/v1", FlashCardCategoryRouter) 



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

