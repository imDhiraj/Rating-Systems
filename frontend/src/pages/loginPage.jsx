import React from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import googleLogo from '../assets/web_light_rd_na.svg';
import githubLogo from '../assets/github-mark.svg';
import { useAuthStore } from '../stores/useAuthStore'



export const loginPage = () => {

  const handleLogin = (data) => {
    try {
     // await signUpPage(data)
      console.log("Login button clicked");
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
    
  }
   return (
    <>
   <div className='justify-center items-center flex'>
    <Card className="w-[380px] min-h-96 mx-auto  mt-20 justify-center shadow-lg bg-white border-orange-200 shadow-orange-100">
  <CardHeader className="space-y-1">
    <CardTitle className="text-orange-900 text-xl">Login</CardTitle>
    <CardDescription className="text-orange-600 text-sm">
      Enter Your Email And Password to Login
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input placeholder="Email" className="border-orange-200 focus:border-orange-500 focus:ring-orange-200" />
    <Input placeholder="Password" type="password" className="border-orange-200 focus:border-orange-500 focus:ring-orange-200" />
  </CardContent>
  <CardFooter className="flex justify-center gap-2">
    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" onClick ={handleLogin }>Login</Button>
    <Button className=" text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-200 hover:bg-linear-to-r hover:from-orange-500 hover:to-red-500" >Sign Up</Button>
  
  
    
   
  </CardFooter>
  <div className="w-60 mx-auto ">   
    <Separator className="bg-orange-400"/>
  </div>
    <div className="flex item-center gap-4 mt-4 px-4">
   <button className="flex items-center gap-2 w-full mx-auto mt-1 px-2 py-2 bg-white border-orange-200 border-1  rounded-full  hover:bg-gray-100 shadow">
  <img src={googleLogo} alt="Google Login" className="w-7 h-7" />
  <span className="text-gray-800 text-xs font-medium">Sign in with Google</span>
</button>
   <button className="flex items-center gap-2 w-full mx-auto mt-1 px-2 py-2 bg-white border-orange-200 border-1   rounded-full  hover:bg-gray-100 shadow">
  <img src={githubLogo} alt="GitHub Login" className="w-6 h-6" />
  <span className="text-gray-800 text-xs font-medium ">Sign in with GitHub</span>
</button>
</div>
</Card>
</div>
    </>
  )
}