const DB = require('../models/permit');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let dbPermit = await DB.find();
    Helper.fMsg(res, 'All Permits', dbPermit);
}

const get = async (req, res, next) => {
    let dbPermit = await DB.findById(req.params.id);
    if (dbPermit) {
        Helper.fMsg(res, 'Single Permit', dbPermit);
    } else {
        next(new Error('No Permit with that id'));
    }
}

const add = async (req, res, next) => {
    let dbPermit = await DB.findOne({ name: req.body.name });
    if (dbPermit) {
        next(new Error('Permit is already exist'));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Permit Saved', result)
    }
}

const patch = async (req, res, next) => {
    let dbPermit = await DB.findById(req.params.id);
    if (dbPermit) {
        let existPermit = await DB.findOne({ name: req.body.name });
        if (existPermit) {
            next(new Error('Permit is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbPermit._id, req.body);
            let result = await DB.findById(req.params.id);
            if (dbPermit.name === req.body.name) {
                Helper.fMsg(res, 'Nothing changed to Original Permit because of the same Permit Name', result);
            } else {
                Helper.fMsg(res, 'Permit Updated', result);
            }
        }
    } else {
        next(new Error('No Permit with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbPermit = await DB.findById(req.params.id);
    if (dbPermit) {
        let permit = dbPermit.name;
        await DB.findByIdAndDelete(dbPermit._id);
        Helper.fMsg(res, `${permit} Permit Deleted`);
    } else {
        next(new Error('No Permit with that id'));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}