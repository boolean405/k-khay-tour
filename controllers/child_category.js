const DB = require('../models/child_category');
const Helper = require('../utils/helper');
const SubCategoryDB = require('../models/sub_category');

const all = async (req, res, next) => {
    let dbChildCategory = await DB.find().populate('sub_category');
    Helper.fMsg(res, 'All Child Categories', dbChildCategory);
}

const get = async (req, res, next) => {
    let dbChildCategory = await DB.findById(req.params.id);
    if (dbChildCategory) {
        Helper.fMsg(res, 'Single ChildCategory', dbChildCategory);
    } else {
        next(new Error('No Child Category with that id'));
    }
}

const add = async (req, res, next) => {
    let dbChildCategory = await DB.findOne({ name: req.body.name });
    if (dbChildCategory) {
        next(new Error('Child Category is already exist'));
    } else {
        let subCat = await SubCategoryDB.findById(req.body.sub_category);
        if (subCat) {
            let childCat = await new DB(req.body).save();
            await SubCategoryDB.findByIdAndUpdate(subCat._id, { $push: { child_categories: childCat._id } });
            let result = await DB.findById(childCat._id).populate('sub_category');
            Helper.fMsg(res, 'Child Category Saved', result)
        } else {
            next(new Error('No Sub Category with that id'));

        }
    }
}

const patch = async (req, res, next) => {
    let dbChildCategory = await DB.findById(req.params.id);
    if (dbChildCategory) {
        let existPermit = await DB.findOne({ name: req.body.name });
        if (existPermit) {
            next(new Error('Child Category is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbChildCategory._id, req.body);
            let result = await DB.findById(req.params.id);
            Helper.fMsg(res, 'Child Category Updated', result);
        }
    } else {
        next(new Error('No Child Category with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbChildCategory = await DB.findById(req.params.id);
    if (dbChildCategory) {
        await SubCategoryDB.findByIdAndUpdate(dbChildCategory.sub_category._id, { $pull: { child_categories: dbChildCategory._id } });
        await DB.findByIdAndDelete(dbChildCategory._id);
        Helper.fMsg(res, `${dbChildCategory.name} ChildCategory Deleted`);
    } else {
        next(new Error('No Child Category with that id'));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}