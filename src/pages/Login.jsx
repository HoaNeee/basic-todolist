import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import Input from "../components/Input";
import "../css/input.css";
import LoginImage from "../assets/login_image.png";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter } from "react-icons/fa6";
import { login } from "../services/api/auth";
import { setCookie } from "../utils/cookie";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: "",
      password: "",
    };
    const formValue = e.target.elements;
    for (let i = 0; i < formValue.length - 2; i++) {
      data[formValue[i].name] = formValue[i].value;
    }
    try {
      if (data.email && data.password) {
        setLoading(true);
        const response = await login(data.email, data.password);
        if (!response || response.code !== 200) {
          throw new Error(response.message);
        }

        setLoading(false);
        const token = response.token;
        toast.success("Login Successfully!");
        setCookie("token", token);
        navigate({
          pathname: "/",
        });
      }
    } catch (error) {
      toast.error(error.message || error);
      setError(error.message || error);
      setLoading(false);
    }
  };

  const handleChangeInput = () => {
    setError("");
  };

  return (
    <div className="bg-white xl:w-6xl lg:w-5xl md:w-3xl w-11/12 h-[622px] md:h-[632px] rounded-lg p-7">
      <div className="w-full h-full md:flex block md:gap-5">
        <div className="md:w-1/2 w-full flex items-center md:h-auto h-full">
          <div className="inline-block w-full">
            <h3 className="font-bold text-2xl">Sign In</h3>
            <form action="" className="mt-3" onSubmit={handleLogin}>
              <div className="flex flex-col gap-3">
                <Input
                  name={"email"}
                  Icon={<MdEmail size={23} />}
                  placeholder={"Enter Email"}
                  onChange={handleChangeInput}
                  require={true}
                  typeInput={"email"}
                />
                <Input
                  name={"password"}
                  typeInput={"password"}
                  Icon={<IoIosLock size={23} />}
                  placeholder={"Enter Password"}
                  onChange={handleChangeInput}
                  require={true}
                />
              </div>
              {
                <div
                  className={`mt-3 ${error ? "block" : " hidden"} text-red-500`}
                >
                  <p>{String(error) || ""}</p>
                </div>
              }
              <Input
                name={"remember-me"}
                type={"checkbox"}
                label={"Remember Me"}
              />
              <div className="">
                <button
                  type="submit"
                  className="font-medium mt-4 text-white w-24 h-14 text-center rounded-lg cursor-pointer px-8 bg-[#FF9090] hover:bg-[#de7777] disabled:bg-gray-400 flex items-center justify-center"
                  disabled={loading}
                >
                  {!loading && <p>Login</p>}
                  {loading && <div className="loader-auth" />}
                </button>
              </div>
            </form>
            <div className="mt-6 flex gap-3 items-center">
              <p>Or, Login with </p>
              <div className="flex gap-2">
                <FaFacebookSquare className="text-blue-700" size={25} />
                <FcGoogle className="" size={25} />
                <FaSquareXTwitter className="" size={25} />
              </div>
            </div>
            <div className="mt-2">
              <p>
                Don’t have an account?{" "}
                <Link to={"/auth/register"} className="text-[#008BD9]">
                  Create One
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 md:block w-0 hidden h-full relative">
          <div className="absolute -bottom-18 -right-6">
            <img
              className="w-[572px] h-[572px] object-contain"
              src={LoginImage}
              alt="this is image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
