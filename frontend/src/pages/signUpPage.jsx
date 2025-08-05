import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from 'react-router-dom'
import googleLogo from '../assets/web_light_rd_na.svg'
import githubLogo from '../assets/github-mark.svg'
// import api from '' // <-- make sure you have this axios instance
import { useAuthStore } from '../stores/useAuthStore'

export const SignUpPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignup = async () => {
    try {
      const res = await api.post('/auth/register', form)
      alert('Signup successful!')
      navigate('/login') // redirect to login after signup
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className='justify-center items-center flex'>
      <Card className="w-[380px] min-h-96 mx-auto mt-20 justify-center shadow-lg bg-white border-orange-200 shadow-orange-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-orange-900 text-xl">SignUp</CardTitle>
          <CardDescription className="text-orange-600 text-sm">
            Enter Your Details to Create an Account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
            className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
          />
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
          />
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            onClick={handleSignup}
          >
            SignUp
          </Button>
          <Button
            className="text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-200"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </CardFooter>
        <div className="w-60 mx-auto">
          <Separator className="bg-orange-400" />
        </div>
        <div className="flex items-center gap-4 mt-4 px-4 pb-4">
          <button className="flex items-center gap-2 w-full px-2 py-2 bg-white border-orange-200 border rounded-full hover:bg-gray-100 shadow">
            <img src={googleLogo} alt="Google Login" className="w-7 h-7" />
            <span className="text-gray-800 text-xs font-medium">Sign in with Google</span>
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-2 bg-white border-orange-200 border rounded-full hover:bg-gray-100 shadow">
            <img src={githubLogo} alt="GitHub Login" className="w-6 h-6" />
            <span className="text-gray-800 text-xs font-medium">Sign in with GitHub</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
