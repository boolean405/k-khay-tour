const DB = require('../models/sub_category');
const CategoryDB = require('../models/category');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let result = await DB.find().populate('parent_category');
    Helper.fMsg(res, 'All Sub Categories', result);
}

const add = async (req, res, next) => {
    const dbSubCat = await DB.findOne({ name: req.body.name });
    if (dbSubCat) {
        next(new Error(`${dbSubCat.name} Sub Category name is already exist`));
    } else {
        let dbCategory = await CategoryDB.findById(req.body.parent_category);
        if (dbCategory) {
            let subCat = await new DB(req.body).save();
            await CategoryDB.findByIdAndUpdate(dbCategory._id, { $push: { sub_categories: subCat._id } });
            let result = await DB.findById(subCat._id).populate('parent_category');
            Helper.fMsg(res, 'Sub Category Uploaded', result);
        } else {
            next(new Error('No Category with that id'));
        }
    }
}

const get = async (req, res, next) => {
    let dbSubCat = await DB.findById(req.params.id).populate('parent_category');
    if (dbSubCat) {
        Helper.fMsg(res, 'Single Sub Category', dbSubCat);
    } else {
        next(new Error('No Sub Category with that id'));
    }
}

const patch = async (req, res, next) => {
    let dbSubCat = await DB.findById(req.params.id);
    if (dbSubCat) {
        let existCat = await DB.findOne({ name: req.body.name });
        if (existCat) {
            next(new Error('Sub Category is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbSubCat._id, req.body);
            let result = await DB.findById(req.params.id).populate('parent_category');
            if (dbSubCat.name === req.body.name) {
                Helper.fMsg(res, 'Nothing changed to Original Sub Category because of the same Sub Category Name', result);
            } else {
                Helper.fMsg(res, 'Sub Category Updated', result);
            }
        }
    } else {
        next(new Error('No Sub Category with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbSubCat = await DB.findById(req.params.id);
    if (dbSubCat) {
        let cat = dbSubCat.name;
        await CategoryDB.findByIdAndUpdate(dbSubCat.parent_category._id, { $pull: { sub_categories: dbSubCat._id } });
        await DB.findByIdAndDelete(dbSubCat._id);
        Helper.fMsg(res, `${cat} Sub Category Deleted`);
    } else {
        next(new Error('No Sub Category with that id'));
    }
}


module.exports = {
    all,
    add,
    get,
    patch,
    drop
}