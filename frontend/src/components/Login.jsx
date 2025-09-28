import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";
const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading ,user} = useSelector((store) => store.auth);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };



  const submitHanlder = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "content-type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        Navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
       toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

   useEffect(()=>{
        if(user){
            Navigate("/");
        }
    },[])

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
          onSubmit={submitHanlder}
        >
          <h1 className="font-bold text-xl mb-5 ">Login</h1>

          <div className="my-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter Your email"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter Your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />

                <Label htmlFor="r1">Student</Label>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  type="radio"
                  name="role"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  value="recruiter"
                  className="cursor-pointer"
                />
                <Label htmlFor="r3">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {loading ? (
            <Button className="w-full mr-2 h-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 ">
              Login
            </Button>
          )}
          <span className="text-sm">
            Don't have an account?
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>{" "}
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
