// Import modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const MongoClient = require("mongodb").MongoClient;

const configData = require("./config/config.json");
const errorHandler = require("./config/error_handler");

const apiRouter = require("./routes");

// App configuration
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

// API routes
app.use("/api", apiRouter);

// Global error handler
app.use(errorHandler);

// Start the server
const port = process.env.PORT ? process.env.PORT || configData.PORT : 4000;
app.listen(port, function() {
  console.log(`App started listening on port : ${port}`);
  MongoClient.connect(
    configData.MONGO_URL,
    {
      useNewUrlParser: true
    },
    (err, db) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log("Successfully connected to MongoDB");
      db.close();
    }
  );
});
