import { body, param, validationResult, query } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";

// import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from "mongoose";
// import Job from '../models/JobModel.js';
import { User } from "../models/baseUserModel.js";
import { Request, Response, NextFunction } from "express";
// import { Request, Response } from "express";
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages: string[] = errors
          .array()
          .map((error) => error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        // if (errorMessages[0].startsWith('no job')) {
        //   throw new NotFoundError(errorMessages);
        // }
        // if (errorMessages[0].startsWith('not authorized')) {
        //   throw new UnauthorizedError('not authorized to access this route');
        // }
        throw new BadRequestError(errorMessages.join(","));
      }
      next();
    },
  ];
};

// this function helps valid user input before the create an account
export const validateRegisterInput = withValidationErrors([
  body("role")
    .notEmpty()
    .withMessage("before creating an account please a user role is required ")
    .custom(async (role, { req }) => {
      if (role == "student") {
        const isDateOfBirth = req.body?.DOB;
        // check is user is student and does the user have a dateofbirth
        if (!isDateOfBirth)
          throw new BadRequestError(
            "creating an account for a student requires a date of birh"
          );
      }
      // another check and take place here
    }),

  body("firstName").notEmpty().withMessage("firstName is required !"),
  body("lastName").notEmpty().withMessage("secondName is required !"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      // check if the user already existed with the email
      const isUserAlreadyExist = await User.findOne({ email });
      if (isUserAlreadyExist)
        throw new BadRequestError(`user already exist with email ${email}`);
    }),
  body("phoneNumber")
    .notEmpty()
    .withMessage("phone Number is required")
    .isLength({ min: 9 })
    .withMessage("phone number must be at least 9 characters long"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists");
      }
    }),

  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);
