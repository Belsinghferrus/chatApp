import mongoose from "mongoose";
import generateToken from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js'

//---------------SIGN UP---------------------
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    //check if email exist
    if (user) {
      return res.json({ success: false, message: "email already exist" });
    }
    //check if password min length
    if (password.length < 6) {
      return res.json({ success: false, message: "Give a strong password" });
    }
    //hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //sign
    const newUser = await User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "User Created",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if email exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "email invalid Credentials" });
    }
   
    
    
    //Unhash pass
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    
    //login
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({ message: "Internal server error" });

  }
};


const updateProfile = async(req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic){
      return res.status(400).json({message:"profile pic is required"})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {profilePic: uploadResponse.secure_url}, 
      {new:true} 
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({message: "Internal server error"})
    
  }
}


const checkAuth = (req, res) =>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({message:"Internal server error"})
  }
}

export { signup, login, logout, updateProfile, checkAuth };
