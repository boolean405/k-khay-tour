require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const Helper = require("./utils/helper");
const Redis = require("./utils/redis");
// Connect Mongo Database
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

// Use Express Json to get Body Data
app.use(express.json());
app.use(fileUpload());

// Router Section
const permitRouter = require("./routes/permit");
const roleRouter = require("./routes/role");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/sub_category");
// const childCategoryRouter = require('./routes/child_category');
const tagRouter = require("./routes/tag");
const deliveryRouter = require("./routes/delivery");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");

// For validation
const { validateToken, validateRole } = require("./utils/validator");

app.use("/permits", permitRouter);
app.use("/roles", validateToken(), validateRole("Owner"), roleRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/subcategories", subCategoryRouter);
// app.use('/childcategories', childCategoryRouter);
app.use("/tags", tagRouter);
app.use("/deliveries", deliveryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

// Error Handling
app.use((err, req, res, next) => {
  // console.error(err.stack)
  err.status = err.status || 500;
  res.status(err.status).json({ con: false, msg: err.message });
});

// Migration Default Data
const defaultData = async () => {
  let migrator = require("./migrations/migrator");
  await migrator.defaultDataMigrate();
  await Helper.timer(1);
  await migrator.backup();
};

// Call all Default Data
// defaultData();

// Run Server
server.listen(
  process.env.PORT,
  console.log(`Server is running at port ${process.env.PORT}`)
);
