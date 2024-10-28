const DB = require("../models/user");
const RoleDB = require("../models/role");
const PermitDB = require("../models/permit");
const Helper = require("../utils/helper");
const Redis = require("../utils/redis");

const all = async (req, res, next) => {
  let dbUser = await DB.find().populate("roles permits");
  Helper.fMsg(res, "All Users", dbUser);
};
const register = async (req, res, next) => {
  let dbEmailUser = await DB.findOne({ email: req.body.email });
  if (dbEmailUser) {
    next(new Error("Email is already exist"));
    return;
  }

  let dbPhoneUser = await DB.findOne({ phone: req.body.phone });
  if (dbPhoneUser) {
    next(new Error("Phone Number is already in use"));
    return;
  }
  req.body.password = Helper.encode(req.body.password);
  let result = await new DB(req.body).save();
  Helper.fMsg(res, "User Register Success", result);
};

// const login = async (req, res, next) => {
//   let dbPhoneUser = await DB.findOne({ phone: req.body.phone }).populate(
//     "roles permits",
//   );
//   if (dbPhoneUser) {
//     if (Helper.comparePassword(req.body.password, dbPhoneUser.password)) {
//       let user = dbPhoneUser.toObject();
//       delete user.password;
//       user.token = Helper.makeToken(user);
//       Redis.set(user._id, user);
//       Helper.fMsg(res, "Login Success", user);
//     } else {
//       next(new Error("Incorrect Password"));
//     }
//   } else {
//     next(new Error("No user found with Phone Number"));
//   }
// };

const login = async (req, res, next) => {
  let dbUser = {};
  let dbPhoneUser = {};
  let dbEmailUser = {};

  if (req.body.phone || req.body.email) {
    if (req.body.phone) {
      dbPhoneUser = await DB.findOne({ phone: req.body.phone }).populate(
        "roles permits",
      );
      if (dbPhoneUser) {
        dbUser = dbPhoneUser;
      } else {
        next(
          new Error(`No User found with this '${req.body.phone}' Phone Number`),
        );
      }
    } else if (req.body.email) {
      dbEmailUser = await DB.findOne({ email: req.body.email }).populate(
        "roles permits",
      );
      if (dbEmailUser) {
        dbUser = dbEmailUser;
      } else {
        next(
          new Error(
            `No User found with this '${req.body.email}' Email Address`,
          ),
        );
      }
    }
    if (dbUser.name) {
      if (Helper.comparePassword(req.body.password, dbUser.password)) {
        let user = dbUser.toObject();
        delete user.password;
        user.token = Helper.makeToken(user);
        Redis.set(user._id, user);
        Helper.fMsg(res, "Login Success", user);
      } else { 
        next(new Error("Incorrect Password"));
      }
    } else {
      next(new Error("Email or Phone must be valid"));
    }
  } else {
    next(new Error("Email or Phone must be contain to Login"));
  }
};

const addRole = async (req, res, next) => {
  let dbUser = await DB.findById(req.body.user_id);
  let dbRole = await RoleDB.findById(req.body.role_id);
  if (dbUser) {
    if (dbRole) {
      let existRole = dbUser.roles.find((rid) => rid.equals(dbRole._id));
      if (existRole) {
        next(
          new Error(
            `${dbRole.name} Role is already exist in ${dbUser.name} User`,
          ),
        );
      } else {
        await DB.findByIdAndUpdate(dbUser._id, {
          $push: { roles: dbRole._id },
        });
        let user = await DB.findById(dbUser._id).populate("roles permits");
        Helper.fMsg(
          res,
          `${dbRole.name} Role added to ${user.name} User`,
          user,
        );
      }
    } else {
      next(new Error("No role found with id"));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const removeRole = async (req, res, next) => {
  let dbUser = await DB.findById(req.body.user_id).populate("roles");
  if (dbUser) {
    let existRole = dbUser.roles.find((rid) => rid.equals(req.body.role_id));
    if (existRole) {
      await DB.findByIdAndUpdate(dbUser._id, {
        $pull: { roles: req.body.role_id },
      });
      Helper.fMsg(
        res,
        `${existRole.name} Role removed from ${dbUser.name} User`,
      );
    } else {
      next(new Error(`Role doesn't exist in ${dbUser.name} User`));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const addPermit = async (req, res, next) => {
  let dbUser = await DB.findById(req.body.user_id);
  let dbPermit = await PermitDB.findById(req.body.permit_id);
  if (dbUser) {
    if (dbPermit) {
      let existPermit = dbUser.permits.find((rid) => rid.equals(dbPermit._id));
      if (existPermit) {
        next(
          new Error(
            `${dbPermit.name} Permit is already exist in ${dbUser.name} User`,
          ),
        );
      } else {
        await DB.findByIdAndUpdate(dbUser._id, {
          $push: { permits: dbPermit._id },
        });
        let user = await DB.findById(dbUser._id).populate("roles permits");
        Helper.fMsg(
          res,
          `${dbPermit.name} Permit added to ${user.name} User`,
          user,
        );
      }
    } else {
      next(new Error("No permit found with id"));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

const removePermit = async (req, res, next) => {
  let dbUser = await DB.findById(req.body.user_id).populate("permits");
  if (dbUser) {
    let existPermit = dbUser.permits.find((rid) =>
      rid.equals(req.body.permit_id),
    );
    if (existPermit) {
      await DB.findByIdAndUpdate(dbUser._id, {
        $pull: { permits: req.body.permit_id },
      });
      Helper.fMsg(
        res,
        `${existPermit.name} Permit removed from ${dbUser.name} User`,
      );
    } else {
      next(new Error(`Permit doesn't exist in ${dbUser.name} User`));
    }
  } else {
    next(new Error("No user found with that id"));
  }
};

module.exports = {
  all,
  register,
  login,
  addRole,
  removeRole,
  addPermit,
  removePermit,
};
