const DB = require("../models/product");
const CategoryDB = require("../models/category");
const SubCategoryDB = require("../models/sub_category");
const ChildCategoryDB = require("../models/child_category");
const TagDB = require("../models/tag");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let pageNum = Number(req.params.page);
  const limit = Number(process.env.PAGE_LIMIT);

  const reqPage = pageNum == 1 ? 0 : pageNum - 1;
  if (pageNum > 0) {
    const skipCount = limit * reqPage;
    let result = await DB.find()
      .skip(skipCount)
      .limit(limit)
      .populate("category sub_category tags");
    Helper.fMsg(
      res,
      `All Products Paginated Page Number ${pageNum}, for ${limit} limited Products`,
      result,
    );
  } else {
    next(new Error(`Page Number must be greater than 0`));
  }
};

const get = async (req, res, next) => {
  let dbProduct = await DB.findById(req.params.id).populate(
    "category sub_category tags",
  );
  if (dbProduct) {
    Helper.fMsg(res, "Single Product", dbProduct);
  } else {
    next(new Error("No Product with that id"));
  }
};

const add = async (req, res, next) => {
  let dbProduct = await DB.findOne({ name: req.body.name });
  if (dbProduct) {
    next(new Error("Product is already exist"));
  } else {
    if (req.body.tags) req.body.tags = Helper.splitTrim(req.body.tags);

    if (req.body.recommended)
      req.body.recommended = Helper.splitTrim(req.body.recommended);

    if (req.body.not_recommended)
      req.body.not_recommended = Helper.splitTrim(req.body.not_recommended);

    if (req.body.highlights)
      req.body.highlights = Helper.splitTrim(req.body.highlights);

    if (req.body.included)
      req.body.included = Helper.splitTrim(req.body.included);

    if (req.body.excluded)
      req.body.excluded = Helper.splitTrim(req.body.excluded);

    if (req.body.to_bring)
      req.body.to_bring = Helper.splitTrim(req.body.to_bring);

    if (req.body.destinations)
      req.body.destinations = Helper.splitTrim(req.body.destinations);

    if (req.body.expect_detail)
      req.body.expect_detail = Helper.splitTrim(req.body.expect_detail);

    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Product Saved", result);
  }
};

const patch = async (req, res, next) => {
  let dbProduct = await DB.findById(req.params.id);
  if (dbProduct) {
    let existPermit = await DB.findOne({ name: req.body.name });
    if (existPermit) {
      next(new Error("Product is already exist"));
    } else {
      await DB.findByIdAndUpdate(dbProduct._id, req.body);
      let result = await DB.findById(req.params.id);
      Helper.fMsg(res, "Product Updated", result);
    }
  } else {
    next(new Error("No Product with that id"));
  }
};

// const patch = async (req, res, next) => {
//   let dbProduct = await DB.findById(req.params.id);
//   if (dbProduct) {
//     let existPermit = await DB.findOne({ name: req.body.name });
//     if (existPermit) {
//       next(new Error("Product is already exist"));
//     } else {
//       if (req.body.recommended)
//         req.body.recommended = Helper.splitTrim(req.body.recommended);

//       if (req.body.not_recommended)
//         req.body.not_recommended = Helper.splitTrim(req.body.not_recommended);

//       if (req.body.highlights)
//         req.body.highlights = Helper.splitTrim(req.body.highlights);

//       if (req.body.included)
//         req.body.included = Helper.splitTrim(req.body.included);

//       if (req.body.excluded)
//         req.body.excluded = Helper.splitTrim(req.body.excluded);

//       if (req.body.to_bring)
//         req.body.to_bring = Helper.splitTrim(req.body.to_bring);

//       if (req.body.destinations)
//         req.body.destinations = Helper.splitTrim(req.body.destinations);

//       if (req.body.expect_detail)
//         req.body.expect_detail = Helper.splitTrim(req.body.expect_detail);

//       await DB.findByIdAndUpdate(dbProduct._id, req.body);
//       let result = await DB.findById(req.params.id);
//       Helper.fMsg(res, "Product Updated", result);
//     }
//   } else {
//     next(new Error("No Product with that id"));
//   }
// };

const drop = async (req, res, next) => {
  let dbProduct = await DB.findById(req.params.id);
  if (dbProduct) {
    await DB.findByIdAndDelete(dbProduct._id);
    Helper.fMsg(res, `${dbProduct.name} Product Deleted`);
  } else {
    next(new Error("No Product with that id"));
  }
};

const filterBy = async (req, res, next) => {
  let type = req.params.type;
  let typeId = req.params.id;
  let pageNum = Number(req.params.page);
  const limit = Number(process.env.PAGE_LIMIT);

  const reqPage = pageNum == 1 ? 0 : pageNum - 1;
  if (pageNum > 0) {
    const skipCount = limit * reqPage;

    let filterType = "";
    let dbFilterbyId = {};

    switch (type) {
      case "category":
        filterType = "category";
        dbFilterbyId = await CategoryDB.findById(typeId);
        break;
      case "subcategory":
        filterType = "sub_category";
        dbFilterbyId = await SubCategoryDB.findById(typeId);
        break;
      case "childcategory":
        filterType = "child_category";
        dbFilterbyId = await ChildCategoryDB.findById(typeId);
        break;
      case "tag":
        filterType = "tags";
        dbFilterbyId = await TagDB.findById(typeId);
        break;
    }
    let filterObj = {};
    filterObj[`${filterType}`] = typeId;
    console.log(filterObj);

    if (!filterType) {
      next(new Error(`No '${type}' Filter Type in Router`));
      return;
    }
    if (dbFilterbyId) {
      let result = await DB.find(filterObj)
        .skip(skipCount)
        .limit(limit)
        .populate("category sub_category tags");

      if (result.length) {
        Helper.fMsg(
          res,
          `All Products Paginated by ${filterType} Page Number ${pageNum}, for ${limit} limited Products`,
          result,
        );
      } else {
        next(
          new Error(
            `All Products Paginated, No more Products with ${filterType} id`,
          ),
        );
      }
    } else {
      next(new Error(`No Products with ${filterType} id`));
    }
  } else {
    next(new Error("Page Number must be greater than 0"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
  filterBy,
};
