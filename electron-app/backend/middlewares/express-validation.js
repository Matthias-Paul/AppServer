import { body, param } from "express-validator";

export const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["sales_rep", "admin", "client"])
    .withMessage("Invalid Role")
];




export const loginValidation = [
  

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

 
];


export const mediaValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be at most 255 characters'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('file_path')
    .notEmpty().withMessage('File path is required')
    .isLength({ max: 500 }).withMessage('File path must be at most 500 characters'),

  body('file_type')
    .notEmpty().withMessage('File type is required')
    .isIn(['audio', 'video', 'image', 'document']).withMessage('Invalid file type'),

  body('file_size')
    .notEmpty().withMessage('File size is required')
    .isInt({ min: 1 }).withMessage('File size must be a positive integer'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid decimal (max 2 decimal places)')
];

export const serviceValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must be at most 255 characters'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('theme')
    .optional()
    .isLength({ max: 200 }).withMessage('Theme must be at most 200 characters'),

  body('banner_image')
    .optional()
    .isLength({ max: 500 }).withMessage('Banner image path must be at most 500 characters'),

  body('is_active')
    .notEmpty().withMessage('Is active is required')
    .isBoolean().withMessage('Is active must be a boolean'),
];

export const serviceMediaValidator = [
  body('service_id')
    .notEmpty().withMessage('service_id is required')
    .isInt({ gt: 0 }).withMessage('service_id must be a positive integer'),

  body('media_id')
    .notEmpty().withMessage('media_id is required')
    .isInt({ gt: 0 }).withMessage('media_id must be a positive integer'),
];

export const transactionValidator = [
  body('user_id')
    .notEmpty().withMessage('user_id is required')
    .isInt({ gt: 0 }).withMessage('user_id must be a positive integer'),

  body('media_id')
    .notEmpty().withMessage('media_id is required')
    .isInt({ gt: 0 }).withMessage('media_id must be a positive integer'),

  body('credits_used')
    .notEmpty().withMessage('credits_used is required')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('credits_used must be a decimal with up to 2 decimal places')
    .custom(value => value > 0).withMessage('credits_used must be greater than 0'),
];




