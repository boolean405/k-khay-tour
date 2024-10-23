const DB = require('../models/category');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let result = await DB.find().populate({
        path: 'sub_categories',
        populate: {
            path: 'child_categories',
            model: 'child_category'
        }
    });
    Helper.fMsg(res, 'All Categories', result);
}

const add = async (req, res, next) => {
    const dbCat = await DB.findOne({ name: req.body.name });
    if (dbCat) {
        next(new Error(`${dbCat.name} Category name is already exist`));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Category Uploaded', result);
    }
}

const get = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        Helper.fMsg(res, 'Single Category', dbCat);
    } else {
        next(new Error('No Category with that id'));
    }
}

const patch = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        let existCat = await DB.findOne({ name: req.body.name });
        if (existCat) {
            next(new Error('Category is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbCat._id, req.body);
            let result = await DB.findById(req.params.id);
            if (dbCat.name === req.body.name) {
                Helper.fMsg(res, 'Nothing changed to Original Category because of the same Category Name', result);
            } else {
                Helper.fMsg(res, 'Category Updated', result);
            }
        }
    } else {
        next(new Error('No Category with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbCat = await DB.findById(req.params.id);
    if (dbCat) {
        let cat = dbCat.name;
        await DB.findByIdAndDelete(dbCat._id);
        Helper.fMsg(res, `${cat} Category Deleted`);
    } else {
        next(new Error('No Category with that id'));
    }
}


module.exports = {
    all,
    add,
    get,
    patch,
    drop
}