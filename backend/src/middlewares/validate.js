const Joi  =  require("joi");


const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
        'string.empty': 'username is required',
        'string.min': 'username must be at least 3 characters long'
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'email is required',
        'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().trim().min(6).required().messages({
        'string.empty': 'password is required',
        'string.min': 'password must be at least 6 characters long'
    }),
    phoneNumber: Joi.string().trim().pattern(/^\d{10}$/).required().messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be exactly 10 digits'
    })
})



const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'email is required'
    }),
    password: Joi.string().trim().required().messages({
        'string.empty': 'password is required'
    })
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            const errors = error.details.map(err => err.message);

            return res.status(400).json({
                success: false,
                errors
            });
        }

        next();
    };
};

module.exports = {validate,registerSchema,loginSchema};