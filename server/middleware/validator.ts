import express from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";

const errorFormatter = ({ msg }: ValidationError) =>
  msg == "Invalid value" ? "tidak valid" : msg;

// parallel processing
const validate = (validations: ValidationChain[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req).formatWith(errorFormatter);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ error: true, errors: errors.mapped() });
  };
};

export default validate;
