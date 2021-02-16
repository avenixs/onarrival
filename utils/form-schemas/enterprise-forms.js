const Joi = require("joi");

exports.REGISTER_COMPANY = Joi.object({
    adminEmail: Joi.string().email().required(),
    adminPassword: Joi.string().min(8).required(),
    adminName: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().required(),
    adminSurname: Joi.string().min(2).max(255).regex(/^([a-zA-Z])*/).trim().required(),
    adminDep: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().required(),
    companyName: Joi.string().min(2).max(255).trim().required(),
    companyEmail:  Joi.string().email().required(),
    companyTel: Joi.string().regex(/(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}/).trim().required(),
})

exports.NEW_REPRESENTATIVE = Joi.object({
    email: Joi.string().email().required(),
    pass: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().required(),
    surname: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().required(),
    dep: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().required(),
    adminRights: Joi.boolean().required()
})

exports.UPDATE_LEADER = Joi.object({
    email: Joi.string().email().optional(),
    pass: Joi.string().min(8).optional().allow(""),
    name: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().optional(),
    surname: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().optional(),
    dep: Joi.string().min(2).max(255).regex(/^([a-zA-Z- ])*/).trim().optional(),
    adminRights: Joi.boolean().optional()
})