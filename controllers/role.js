const DB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    let dbRole = await DB.find().populate('permits');
    Helper.fMsg(res, 'All Roles', dbRole);
}

const get = async (req, res, next) => {
    let dbRole = await DB.findById(req.params.id).populate('permits');
    if (dbRole) {
        Helper.fMsg(res, 'Single Role', dbRole);
    } else {
        next(new Error('No Role with that id'));
    }
}

const add = async (req, res, next) => {
    let dbRole = await DB.findOne({ name: req.body.name });
    if (dbRole) {
        next(new Error('Role is already exist'));
    } else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res, 'Role Saved', result)
    }
}

const patch = async (req, res, next) => {
    let dbRole = await DB.findById(req.params.id);
    if (dbRole) {
        let existPermit = await DB.findOne({ name: req.body.name });
        if (existPermit) {
            next(new Error('Role is already exist'));
        } else {
            await DB.findByIdAndUpdate(dbRole._id, req.body);
            let result = await DB.findById(req.params.id).populate('permits');
            Helper.fMsg(res, 'Role Updated', result);
        }
    } else {
        next(new Error('No Role with that id'));
    }
}

const drop = async (req, res, next) => {
    let dbRole = await DB.findById(req.params.id);
    if (dbRole) {
        await DB.findByIdAndDelete(dbRole._id);
        Helper.fMsg(res, `${dbRole.name} Role Deleted`);
    } else {
        next(new Error('No Role with that id'));
    }
}

const addPermit = async (req, res, next) => {
    let dbRole = await DB.findById(req.body.role_id);
    let dbPermit = await PermitDB.findById(req.body.permit_id);
    if (dbRole) {
        let dbExistPermit = dbRole.permits.find(id => id == req.body.permit_id);
        if (dbExistPermit) {
            next(new Error(`${dbPermit.name} is already in ${dbRole.name} Role`));
        } else {
            await DB.findByIdAndUpdate(dbRole._id, { $push: { permits: dbPermit._id } });
            let result = await DB.findById(dbRole._id).populate('permits');
            Helper.fMsg(res, `${dbPermit.name} Permission added to ${dbRole.name} Role`, result);
        }
    }
    else if (!dbRole && dbPermit) {
        next(new Error('Role Id must valid'))
    } else if (!dbPermit && dbRole) {
        next(new Error('Permit Id must valid'))
    }
    else {
        next(new Error('Role Id and Permit Id must valid'));
    }
}

const removePermit = async (req, res, next) => {
    let dbRole = await DB.findById(req.body.role_id);
    let dbPermit = await PermitDB.findById(req.body.permit_id);
    if (dbRole) {
        let dbExistPermit = dbRole.permits.find(id => id == req.body.permit_id);
        if (dbExistPermit) {
            await DB.findByIdAndUpdate(dbRole._id, { $pull: { permits: dbPermit._id } });
            let result = await DB.findById(dbRole._id).populate('permits');
            Helper.fMsg(res, `${dbPermit.name} Permission removed from ${dbRole.name} Role`, result);
        } else {
            next(new Error(`Not found input Permission to delete from ${dbRole.name} Role`));
        }
    }
    else if (!dbRole && dbPermit) {
        next(new Error('Role Id must valid'))
    } else if (!dbPermit && dbRole) {
        next(new Error('Permit Id must valid'))
    }
    else {
        next(new Error('Role Id and Permit Id must valid'));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop,
    addPermit,
    removePermit
}
