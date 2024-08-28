import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("File path is not provided.");
      return null;
    }

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Error during file upload:", error);

    // Attempt to delete the file locally if an error occurs
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error("Error removing the file:", unlinkError);
    }

    return null;
  }
};

const deleteFilesOnCloudinary = async (cloudFilePath) => {
  try {
    const publicId = cloudFilePath.split("/").slice(-1)[0].split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId);

    console.log("File deleted successfully");
    return response;
  } catch (error) {
    console.log("Error deleting file: ", error);
  }
};

export { uploadFileOnCloudinary, deleteFilesOnCloudinary };
