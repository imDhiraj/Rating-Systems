import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

import { prisma } from "../libs/db.js";



export const registerUser = async (req, res) => {
  const { name, password, email ,address } = req.body;
    try {
   
     // Validate input data 
    if (!name || !password || !email || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });

    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });         
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create new user          
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword, 
        email,
        address, 
        
      },
    });


    // For demonstration purposes, we'll just return a success message
    return res.status(201).json({ message: 'User registered successfully', newUser: { name, email,role:user.role } });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password with hashed password
     const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        error: "Invalid Credentials", // Fixed typo
      });
    }

    const token= jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days expiration
        httpOnly: true,
        secure:true, 
    };

    res.cookie('token',
         token,
         cookieOptions
        ); 
      
    return res.status(200).json(
        { 
            message: 'User signed in successfully', 
            user: { name: user.name, email: user.email } ,
            token: token,
        }
    );
  } catch (error) {
    console.error('Error signing in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export const logoutUser = async (req, res) => {
  try {

    // Clear the JWT cookie
    res.clearCookie('token', { httpOnly: true, secure: true });

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input data
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the hashed password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });



    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
