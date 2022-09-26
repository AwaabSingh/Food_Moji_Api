import { Request, Response, NextFunction } from 'express';
import { VendorLoginInput, EditVendorInput } from '../dto/Vendor.dto';
import { FindVendor } from './AdminController';
import {
  validatePassword,
  GenerateSignature,
} from '../utility/PasswordUtility';
import { CreateFoodInput } from '../dto';
import { Food } from '../models';

/**
 * @param Vendor Login
 * @param {POST} /api/vendor/login
 * @param Public
 */
export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = <VendorLoginInput>req.body;

    const existingVendor = await FindVendor('', email);

    if (existingVendor !== null) {
      // validation
      const validation = await validatePassword(
        password,
        existingVendor.password,
        existingVendor.salt
      );

      if (validation) {
        const { _id, name, email, foodType } = existingVendor;

        const signature = GenerateSignature({
          _id,
          name,
          email,
          foodType,
        });

        return res.status(200).json(signature);
      } else {
        return res.status(400).json({
          message: 'Invalid Credentials',
        });
      }
    }

    return res.status(400).json({
      message: 'Invalid Credentials',
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param Get Vendor profile
 * @param {GET} /api/vendor/profile
 * @param Public
 */
export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const exisitingVendor = await FindVendor(user._id);

      return res.status(200).json(exisitingVendor);
    }

    return res.status(404).json({
      message: 'Vendor Not Found',
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param Update Vendor Profile
 * @param {PATCH or PUT} /api/vendor/profile
 * @param Private/Vendor
 */
export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address, foodType, phone } = <EditVendorInput>req.body;
    const user = req.user;

    if (user) {
      const exisitingVendor = await FindVendor(user._id);

      if (exisitingVendor !== null) {
        exisitingVendor.name = name;
        exisitingVendor.address = address;
        exisitingVendor.phone = phone;
        exisitingVendor.foodType = foodType;

        const savedResult = await exisitingVendor.save();
        return res.status(200).json(savedResult);
      }
      return res.status(200).json(exisitingVendor);
    }

    return res.status(404).json({
      message: 'Vendor Not Found',
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param Update Vendor Cover Image
 * @param {PATCH or PUT} /api/vendor/profile
 * @param Private/Vendor
 */

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }
  return res.json({ message: 'Unable to Update vendor profile ' });
};

/**
 * @param Update Vendor Service
 * @param {PATCH or PUT} /api/vendor/service
 * @param Private/Vendor
 */
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const exisitingVendor = await FindVendor(user._id);

      if (exisitingVendor !== null) {
        exisitingVendor.serviceAvailable = !exisitingVendor.serviceAvailable;
        const savedResult = await exisitingVendor.save();
        return res.status(200).json(savedResult);
      }
    }
    return res.status(404).json({
      message: 'Vendor Not Found',
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param Add Food
 * @param {POST} /api/vendor/food
 * @param Private/Vendor
 */
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodInput
  >req.body;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const food = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        rating: 0,
        readyTime: readyTime,
        foodType: foodType,
        images: images,
      });

      vendor.foods.push(food);
      const result = await vendor.save();
      return res.json(result);
    }
  }
  return res.json({ message: 'Something went wrong' });
};

/**
 * @param Get all Foods
 * @param {GET} /api/vendor/foods
 * @param Private/Vendor
 */
export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const foods = await Food.find({ vendor: user._id });

      if (foods !== null) {
        return res.status(200).json(foods);
      }
    }
    return res.status(404).json({
      message: 'Food Information Not Found',
    });
  } catch (error) {
    console.log(error);
  }
};
