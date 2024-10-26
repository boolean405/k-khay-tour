const DB = require("../models/delivery");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let dbDelivery = await DB.find();
  Helper.fMsg(res, "All Deliveries", dbDelivery);
};

const get = async (req, res, next) => {
  let dbDelivery = await DB.findById(req.params.id);
  if (dbDelivery) {
    Helper.fMsg(res, "Single Delivery", dbDelivery);
  } else {
    next(new Error("No Delivery with that id"));
  }
};

const add = async (req, res, next) => {
  let dbDelivery = await DB.findOne({ name: req.body.name });
  if (dbDelivery) {
    next(new Error("Delivery is already exist"));
  } else {
    if (req.body.remarks) {
      req.body.remarks = req.body.remarks.split(",").map((str) => str.trim());
    }
    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Delivery Saved", result);
  }
};

const patch = async (req, res, next) => {
  let dbDelivery = await DB.findById(req.params.id);
  if (dbDelivery) {
    let existPermit = await DB.findOne({ name: req.body.name });
    if (existPermit) {
      next(new Error("Delivery is already exist"));
    } else {
      if (req.body.remarks) {
        req.body.remarks = req.body.remarks.split(",").map((str) => str.trim());
      }
      await DB.findByIdAndUpdate(dbDelivery._id, req.body);
      let result = await DB.findById(req.params.id);
      if (dbDelivery.name === req.body.name) {
        Helper.fMsg(
          res,
          "Nothing changed to Original Delivery because of the same Delivery Name",
          result,
        );
      } else {
        Helper.fMsg(res, "Delivery Updated", result);
      }
    }
  } else {
    next(new Error("No Delivery with that id"));
  }
};

const drop = async (req, res, next) => {
  let dbDelivery = await DB.findById(req.params.id);
  if (dbDelivery) {
    await DB.findByIdAndDelete(dbDelivery._id);
    Helper.fMsg(res, `${dbDelivery.name} Delivery Deleted`);
  } else {
    next(new Error("No Delivery with that id"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
};
