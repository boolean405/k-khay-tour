const DB = require("../models/order");
const OrderItemDB = require("../models/order_item");
const ProductDB = require("../models/product");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let user = req.user;
  let dbOrders = await DB.find({ user: user._id })
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "product",
      },
    })
    .populate("user");

  if (dbOrders) {
    Helper.fMsg(res, `${user.name}'s Orders`, dbOrders);
  } else {
    next(new Error(`No order yet in ${user.name} User`));
  }
};

const add = async (req, res, next) => {
  const user = req.user;
  const items = req.body.items;

  if (items && items[0].product_id && items[0].count) {
    let saveOrder = new DB();
    let orderItemsObj = [];
    let total = 0;
    for await (let item of items) {
      let product = await ProductDB.findById(item.product_id);
      let obj = {
        order: saveOrder._id,
        count: item.count,
        product: product._id,
      };
      orderItemsObj.push(obj);
      total += product.price * item.count;
    }

    let orderItemResult = await OrderItemDB.insertMany(orderItemsObj);
    console.log(orderItemResult);
    let orderItemIds = orderItemResult.map((item) => item._id);

    saveOrder.user = user._id;
    saveOrder.items = orderItemIds;
    saveOrder.count = items.length;
    saveOrder.total = total;

    let result = await saveOrder.save();
    Helper.fMsg(res, `Order Accepted`, result);
  } else {
    next(new Error("Can't Order without product and count"));
  }
};

// const patch = async (req, res, next) => {
//   let dbOrder = await DB.findById(req.params.id);
//   if (dbOrder) {
//     let existOrder = await DB.findOne({ name: req.body.name });
//     if (existOrder) {
//       next(new Error("Order is already exist"));
//     } else {
//       if (req.body.free_pickup_zone) {
//         req.body.free_pickup_zone = req.body.free_pickup_zone
//           .split(",")
//           .map((str) => str.trim());
//       }
//       if (req.body.extra_charge_pickup_zone) {
//         req.body.extra_charge_pickup_zone = req.body.extra_charge_pickup_zone
//           .split(",")
//           .map((str) => str.trim());
//       }
//       await DB.findByIdAndUpdate(dbOrder._id, req.body);
//       let result = await DB.findById(req.params.id);
//       if (dbOrder.name === req.body.name) {
//         Helper.fMsg(
//           res,
//           "Nothing changed to Original Order because of the same Order Name",
//           result,
//         );
//       } else {
//         Helper.fMsg(res, "Order Updated", result);
//       }
//     }
//   } else {
//     next(new Error("No Order with that id"));
//   }
// };

// const drop = async (req, res, next) => {
//   let dbOrder = await DB.findById(req.params.id);
//   if (dbOrder) {
//     let order = dbOrder.name;
//     await DB.findByIdAndDelete(dbOrder._id);
//     Helper.fMsg(res, `${order} Order Deleted`);
//   } else {
//     next(new Error("No Order with that id"));
//   }
// };

module.exports = {
  all,
  add,
  // get,
  // patch,
  // drop,
};
