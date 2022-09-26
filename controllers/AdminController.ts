import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto/Vendor.dto';
import { Vendor } from '../models';
import { GenerateSalt, GeneratePassword } from '../utility/PasswordUtility';

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email });
  } else {
    return await Vendor.findById(id);
  }
};

/**
 * @param Create a vendor
 * @param {POST} api/admin/vendor
 * @param Private/Admin
 */
export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      address,
      pincode,
      foodType,
      email,
      password,
      ownerName,
      phone,
    } = <CreateVendorInput>req.body;

    //  Check if vendor already exist
    const existingVendor = await FindVendor('', email);

    if (existingVendor !== null)
      return res.status(400).json({ message: 'Vendor already exist' });

    // Generate salt for password encryption
    const genSalt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, genSalt);

    const createVendor = await Vendor.create({
      name: name,
      address: address,
      pincode: pincode,
      foodType: foodType,
      email: email,
      password: userPassword,
      salt: genSalt,
      ownerName: ownerName,
      phone: phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
      foods: []
    });

    return res.status(201).json(createVendor);
  } catch (error) {
    res.status(400);
    throw new Error('Error');
    console.log(error);
  }
};

/**
 * @param Get all vendors
 * @param {GET} /api/admin/vendor
 * @param Private/Admin
 */
export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vendor.find();

    if (vendors !== null) {
      return res.status(200).json(vendors);
    }

    return res.status(404).json({
      message: 'Vendors data not avaliable',
    });
  } catch (error) {
    res.status(400);
    throw new Error('Error');
    console.log(error);
  }
};

/**
 * @param Get a single vendors
 * @param {GET} /api/admin/vendor/:id
 * @param Private/Admin
 */
export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;

    const vendor = await FindVendor(vendorId);

    if (vendor !== null) {
      return res.status(200).json(vendor);
    }

    return res.status(404).json({
      message: 'Vendors data not avaliable',
    });
  } catch (error) {
    res.status(400);
    throw new Error('Error');
    console.log(error);
  }
};
