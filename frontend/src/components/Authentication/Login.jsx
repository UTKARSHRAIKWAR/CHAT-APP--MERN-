import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);

  const showPass = () => setShow(!show);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", { email, password });
  };

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <h2>Email</h2>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <h2>password</h2>
        <div className="flex justify-between gap-2">
          <Input
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
        <Button variant="outline" type="submit" className="w-full">
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
