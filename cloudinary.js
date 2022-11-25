import dotenv from "dotenv";
import cloudinary from 'cloudinary'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

export const upload=async (file)=>{
    const image=await cloudinary.v2.uploader.upload(file,(result)=>result)
    return image 
}