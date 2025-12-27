import React, { useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PiEyeClosedDuotone } from "react-icons/pi";
import { LiaEyeSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { setUser } from "../../Store/Slices/UserSlice";


// EndPoint -> /auth/login
// Data -> Username - Password

export default function Login({theme}) {

  // states
  const [isPassword, setIsPassword] = useState(true);
  const [isLoading, setLoading] = useState(false);

  // ref
  const usernameRef = useRef();
  const passwordRef = useRef();

  // navigation
  const go = useNavigate();

  // dispatch
  const dispatch = useDispatch();

  // Get Data - Endpoint - Error - Response -> Store User Info Redux & LocalStorage -> Go Home
  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      // Trigger Loading
      setLoading(true);

      // Get Data
      const data = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      // Endpoint
      const response = await api.post("/auth/login", data);
        const role =
      response.data.username === "emilys" ? "admin" : "user";

    const userData = {
      ...response.data,
      role,
    };
      // Store Redux
      dispatch(setUser(userData));
      // Store Localstorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Message
      toast.success("Login Successfully!");

      // Check Role User | Admin Redirect to Dashboard else Home -> Endpoint auth/me
      
      // Redirect to Dashboard if role = admin else go home
        if(role === "admin"){
          go("/dashboard")
        }else{
          go("/")
        }
    } catch (error) {
      // Handle Error
      toast.error(error?.response?.data?.message || "Network Error!");
    } finally {
      // Close Loading
      setLoading(false);
    }
  }
     
  return (
    <div className=" vh-100 d-flex  justify-content-center  align-items-center  ">
     <Toaster position="bottom-right"></Toaster>
      <div className={` w-75 border ${
    theme === "light" ? "shadow" : "shadow-dark"} p-3 rounded-4  d-flex flex-column justify-content-center `}>
      <h3 className=" text-center font4 mt-4 text-warning">Login</h3>

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            placeholder="Type your username."
            ref={usernameRef}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>

          <InputGroup>
            <Form.Control
              type={isPassword ? "password" : "text"}
              id="password"
              name="password"
              placeholder="Type your password."
              
              ref={passwordRef}
            />

            <InputGroup.Text className=" cursor-pointer" onClick={() => setIsPassword((prev) => !prev)}>
              {isPassword ? <LiaEyeSolid /> : <PiEyeClosedDuotone />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Button
          type="submit"
          variant={isLoading ? "secondary" : "primary"}
          disabled={isLoading}
          className="w-75 d-block mt-4 rounded-4  mx-auto"
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
        <p className=" text-center mt-2">Don't have an account? <Link className=" text-warning"  to={"/register"}>Sign Up</Link></p>
      </Form>
      </div>
    </div>
  );
};
