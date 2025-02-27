import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const showPass = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    // if (pic === undefined) {
    //   toast({
    //     title: "Please select an image! ",
    //     duration: 5000,
    //   });
    //   return;
    // }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "CHAT-APP");
      data.append("cloud_name", "dzqi8sns4");
      fetch("https://api.cloudinary.com/v1_1/dzqi8sns4/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image! ",
        duration: 5000,
      });
      setLoading(false);
      return;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Do Not Match",
        duration: 3000,
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
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
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

    // console.log("Form Data:", {
    //   name,
    //   email,
    //   password,
    //   confirmPassword,
    //   pic,
    // });
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
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <h2>Password</h2>
        <Input
          value={password}
          type={show ? "text" : "password"}
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <h2>Confirm password</h2>
        <div className="flex justify-between gap-2">
          <Input
            value={confirmPassword}
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
          accept="image/*"
          placeholder="Upload"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        <Button
          variant="destructive"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
