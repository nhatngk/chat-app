const { validationResult } = require("express-validator");
const createError = require("http-errors");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(createError(401,{message:  errors.array()[0].msg}));
    }
    next();
};

module.exports = validate;
