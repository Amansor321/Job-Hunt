import {User} from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloundinary.js";

export const register= async (req,res)=>{
    try{
        const {fullName,email,phoneNumber,password,role}= req.body;
       // console.log(fullName,email,phoneNumber,password,role)

        if(!fullName || !email || !phoneNumber || !password || !role ){
            return res.status(400).json({ message: 'All fields are required' });
        }

            // Handle optional file
    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

        //      const file = req.file;
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

      
        const user= await User.findOne({email});
        if(user){
            return res.status(400).json({ message: 'Email already in use' });

        }

        const hashedPassword = await  bcrypt.hash(password,10);

        

        await User.create({
            fullName,
        email,phoneNumber,
        password:hashedPassword,
        role,
       profile:{
              profilePhoto
            },

        })

      return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            User,
            
        });

    } catch (error){
          console.error(error);
    return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
    });

    }
}



export const login= async (req,res)=>{
    try{
        const {email,password,role}= req.body;

        if( !email || !password || !role){
             return res.status(400).json({ message: 'Email and password are required' });

        }


           // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch= await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
             return res.status(400).json({ message: 'Invalid credentials' });

        }

        // check role is correct or not

        if(role !== user.role){
             return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })

        };


           // Generate JWT Token

           const tokenData= {
            userId:user._id
           }

           const token = await jwt.sign(tokenData,process.env.SECRET_KEY,  { expiresIn: '1d' });

              user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
         





 return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true
        })



    } catch (error){
          console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error });


    }
}



export const logout= async (req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
                 message: "Logged out successfully.",
            success: true
          
        })
    } catch (error){
          console.log(error);

    }
}


export const updateProfile= async (req,res)=>{
    try{
        const {fullName,email,phoneNumber,bio,skills}= req.body;

        const file= req.file;

        const fileUri= getDataUri(file);
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content);

      

       
let skillsArray;
if(skills){
    skillsArray=skills.split(",");

}
       
        const userId= req.id; // middleware authentication
        
        let user= await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        };

  // updating data
        if(fullName) user.fullName = fullName
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray


        if(cloudResponse){
            user.profile.resume=cloudResponse.secure_url;
            user.profile.resumeOriginalName=file.originalname
        }
        await user.save();

               user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        
        }


        return res.status(200).json({
            message:"Profile Updated Successfully",
            user,
            success:true
        });

    } catch (error){
        console.log(error);

    }
}