const DB = require('../models/tag');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let dbTag = await DB.find();
    Helper.fMsg(res, 'All Tag', dbTag);
}

const get = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id);
    if (dbTag) {
        Helper.fMsg(res, 'Single Tag', dbTag);
    } else {
        next(new Error('No Tag with that id'));
    }
}

const add = async (req, res, next) => {
    let dbTag = await DB.findOne({ name: req.body.name });
    if (dbTag) {
        next(new Error('Tag is already exist'));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Tag Saved', result)
    }
}

const patch = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id);
    if (dbTag) {
        let existPermit = await DB.findOne({ name: req.body.name });
        if (existPermit) {
            next(new Error('Tag is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbTag._id, req.body);
            let result = await DB.findById(req.params.id);
            if (dbTag.name === req.body.name) {
                Helper.fMsg(res, 'Nothing changed to Original Tag because of the same Tag Name', result);
            } else {
                Helper.fMsg(res, 'Tag Updated', result);
            }
        }
    } else {
        next(new Error('No Tag with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbTag = await DB.findById(req.params.id);
    if (dbTag) {
        await DB.findByIdAndDelete(dbTag._id);
        Helper.fMsg(res, `${dbTag.name} Tag Deleted`);
    } else {
        next(new Error('No Tag with that id'));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}