import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // remove the file from local storage
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteOnCloudinary = async (cloudinaryFileUrl) => {
  try {
    const fileToDelete = cloudinaryFileUrl
      .split("/")
      [--cloudinaryFileUrl.split("/").length].split(".")[0];

    const response = await cloudinary.api.delete_resources([fileToDelete], {
      type: "upload",
      resource_type: "image",
    });

    return response;
  } catch (error) {
    console.log(error.message);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
