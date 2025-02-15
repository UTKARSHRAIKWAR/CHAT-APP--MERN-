import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);

  const showPass = () => setShow(!show);

  const postDetails = (pics) => {};

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", { name, email, password, confirmPassword, pic });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Name</h2>
        <Input
          value={name}
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />

        <h2>Email</h2>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <h2>Password</h2>
        <Input
          type={show ? "text" : "password"}
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <h2>Confirm password</h2>
        <div className="flex justify-between gap-2">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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

        <h2>Upload Profile Photo</h2>
        <Input
          type="file"
          accept="images/*"
          placeholder="Upload"
          onChange={(e) => postDetails(e.target.value[0])}
        />
        <Button variant="outline" type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
