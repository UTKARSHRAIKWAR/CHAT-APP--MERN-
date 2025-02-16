import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const showPass = () => setShow(!show);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Login Successful",
        description: "Logged in successfully!",
        variant: "default",
        duration: 5000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong!",
        variant: "destructive",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    console.log("Form Data:", { email, password });
  };

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <h2>Email</h2>
        <Input
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <h2>password</h2>
        <div className="flex justify-between gap-2">
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="ghost"
            type="button"
            onClick={showPass}
            className="w-10"
          >
            {show ? "Hide" : "Show"}
          </Button>
        </div>
        <Button
          variant="outline"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          Login
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>
      </form>
    </div>
  );
};

export default Login;
