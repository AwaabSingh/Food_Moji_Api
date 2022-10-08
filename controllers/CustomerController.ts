import { NextFunction, Response, Request } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs } from '../dto';
import { validate } from 'class-validator';
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
} from '../utility/PasswordUtility';
import { Customer } from '../models';
import { GenerateOtp, onRequestOTP } from '../utility/NotificationUtility';

/**
 * @param Register Customer
 * @param {POST} /api/customer/signup
 * @param Public
 */
export const CustomersSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    const validationError = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    // const existingCustomer = await Customer.find({ email: email });

    // if (existingCustomer !== null) {
    //   return res.status(400).json({ message: 'Email already exist!' });
    // }

    const result = await Customer.create({
      email: email,
      password: userPassword,
      salt: salt,
      phone: phone,
      otp: otp,
      otp_expiry: expiry,
      firstName: '',
      lastName: '',
      address: '',
      verified: false,
      lat: 0,
      lng: 0
    });

    if (result) {
      // send OTP to customer
      await onRequestOTP(otp, phone);

      //Generate the Signature
      const signature = await GenerateSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified,
      });
      // Send the result
      return res
        .status(201)
        .json({ signature, verified: result.verified, email: result.email });
    }

    return res.status(400).json({ msg: 'Error while creating user' });

};

/**
 * @param Authenticate/Login Customer
 * @param {POST} /api/customer/login
 * @param Public
 */
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * @param Verify Customer After Login
 * @param {PATCH} /api/customer/verify
 * @param Private/Customer
 */
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * @param Get OTP Codes
 * @param {PATCH} /api/customer/otp
 * @param Private/Customer
 */
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * @param Get Customer Profile
 * @param {GET} /api/customer/profile
 * @param Private/Customer
 */
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * @param Update Customer Profile
 * @param {PATCH} /api/customer/profile
 * @param Private/Customer
 */
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
