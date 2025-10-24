import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../config/token.js";

export const signUp = async(req,res)=>{
    const{name,email,password,userName}=req.body;
    if(!name || !email || !password || !userName){
        return res.status(400).json({message:"All fields are required"});
    }
    const existingUserEmail = await User.findOne({email});
    if(existingUserEmail){
        return res.status(409).json({message:"User with this Email already in use"});
    }
    const existingUserName = await User.findOne({userName});
    if(existingUserName){
        return res.status(409).json({message:"User with this Username already in use"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);

    const newUser = await User.create({name,email,password:hashedPassword,userName});
    const token = await generateToken(newUser._id);
    // Set cookie with safer sameSite handling for dev vs prod
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30*24*60*60*1000
    });

    // Return user without password
    const safeUser = await User.findById(newUser._id).select('-password');
    return res.status(201).json(safeUser);
}

export const signIn = async(req,res)=>{
    const {userName,password} = req.body;
    if(!userName || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const user = await User.findOne({userName});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid credentials"});
    }
    const token = await generateToken(user._id);
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30*24*60*60*1000
    });
    const safeUser = await User.findById(user._id).select('-password');
    return res.status(200).json({message:"SignIn successful", user: safeUser});
}

export const signOut = async(req,res)=>{
    try {
        // Clear cookie with same options used when setting it so browser removes it
        res.clearCookie('token', { httpOnly: true, sameSite: 'strict', path: '/' });
        console.log('Cleared token cookie for signout');
        return res.status(200).json({message:"SignOut successful"});
    } catch(error) {
        console.error("Error during signout:", error);
        return res.status(500).json({message:"Server Error"});
    }
}
