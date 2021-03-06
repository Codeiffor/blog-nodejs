import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import router from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blogs", { useNewUrlParser: true })
  .then(() => {
    app.use("/api", router);
    app.use(errorHandler);

    const clientBuildPath = path.join(__dirname, "../client/build");
    const clientBaseFile = path.join(clientBuildPath, "index.html");
    app.use(express.static(clientBuildPath));
    app.get("*", (req, res) => {
      res.sendFile(clientBaseFile);
    });

    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`server running on port ${port}`));
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
