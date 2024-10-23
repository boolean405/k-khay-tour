const DB = require('../models/product');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let dbProduct = await DB.find().populate('category sub_category tags');
    Helper.fMsg(res, 'All Products', dbProduct);
}

const get = async (req, res, next) => {
    let dbProduct = await DB.findById(req.params.id).populate('category sub_category tags');
    if (dbProduct) {
        Helper.fMsg(res, 'Single Product', dbProduct);
    } else {
        next(new Error('No Product with that id'));
    }
}

const add = async (req, res, next) => {
    let dbProduct = await DB.findOne({ name: req.body.name });
    if (dbProduct) {
        next(new Error('Product is already exist'));
    } else {
        if (req.body.recommended) {
            req.body.recommended = req.body.recommended.split(',').map(str => str.trim());
        }
        if (req.body.not_recommended) {
            req.body.not_recommended = req.body.not_recommended.split(',').map(str => str.trim());
        }
        if (req.body.highlights) {
            req.body.highlights = req.body.highlights.split(',').map(str => str.trim());
        }
        if (req.body.included) {
            req.body.included = req.body.included.split(',').map(str => str.trim());
        }
        if (req.body.excluded) {
            req.body.excluded = req.body.excluded.split(',').map(str => str.trim());
        }
        if (req.body.to_bring) {
            req.body.to_bring = req.body.to_bring.split(',').map(str => str.trim());
        }
        if (req.body.destinations) {
            req.body.destinations = req.body.destinations.split(',').map(str => str.trim());
        }
        if (req.body.expect_detail) {
            req.body.expect_detail = req.body.expect_detail.split(',').map(str => str.trim());
        }
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Product Saved', result)
    }
}

const patch = async (req, res, next) => {
    let dbProduct = await DB.findById(req.params.id);
    if (dbProduct) {
        let existPermit = await DB.findOne({ name: req.body.name });
        if (existPermit) {
            next(new Error('Product is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbProduct._id, req.body);
            let result = await DB.findById(req.params.id);
            Helper.fMsg(res, 'Product Updated', result);
        }
    } else {
        next(new Error('No Product with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbProduct = await DB.findById(req.params.id);
    if (dbProduct) {
        await DB.findByIdAndDelete(dbProduct._id);
        Helper.fMsg(res, `${dbProduct.name} Product Deleted`);
    } else {
        next(new Error('No Product with that id'));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}