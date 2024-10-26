const Joi = require("joi");

module.exports = {
  PermitSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string().required(),
    }),
  },

  RoleSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string().required(),
    }),
    addPermit: Joi.object({
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/) 
        .required(),
    }),
    removePermit: Joi.object({
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },

  UserSchema: {
    register: Joi.object({
      name: Joi.string().min(4).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(8).max(12).required(),
      password: Joi.string().min(8).max(16).required(),
      re_password: Joi.ref("password"),
    }),
    login: Joi.object({
      phone: Joi.string().min(8).max(12).required(),
      password: Joi.string().min(8).max(16).required(),
    }),
    addRole: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    removeRole: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    addPermit: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    removePermit: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  CategorySchema: {
    add: Joi.object({
      name: Joi.string().required(),
      image: Joi.string().required(),
      free_pickup_zone: Joi.string().required(),
      extra_charge_pickup_zone: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
      image: Joi.string(),
      free_pickup_zone: Joi.string(),
      extra_charge_pickup_zone: Joi.string(),
    }),
  },
  SubCategorySchema: {
    add: Joi.object({
      parent_category: Joi.string().required(),
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  ChildCategorySchema: {
    add: Joi.object({
      sub_category: Joi.string().required(),
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  TagSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  DeliverySchema: {
    add: Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      duration: Joi.string().required(),
      remarks: Joi.string(),
    }),
    patch: Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      duration: Joi.string(),
      remarks: Joi.string(),
    }),
  },
  ProductSchema: {
    add: Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      discount: Joi.number().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      discount: Joi.number(),
    }),
  },

  AllSchema: {
    id: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
