import React from "react";
import RegisterImage from "../assets/register_image.png";
import { FaUserEdit } from "react-icons/fa";
import { RiUser3Fill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";
import { register } from "../services/api/auth";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {};
    const formValue = e.target.elements;

    for (let i = 0; i < formValue.length - 1; i++) {
      const name = formValue[i].name;
      const value = formValue[i].value;
      if (name === "terms") {
        data[name] = formValue[i].checked;
        continue;
      }

      data[name] = value;
    }
    if (!data.terms) {
      setError("Please agree with our terms");
    } else if (data.confimPassword !== data.password) {
      setError("Confirm password and password not match!");
    } else {
      delete data.terms;
      try {
        setLoading(true);
        const response = await register(data);
        if (!response || response.code !== 200) {
          throw new Error(response.message || "ERROR");
        }
        toast.success(response.message);
        setLoading(false);
        navigate("/auth/login");
      } catch (error) {
        setLoading(false);
        toast.error(error.message || error);
      }
    }
  };

  const handleChange = () => {
    setError("");
  };

  return (
    <div className="bg-white xl:w-6xl lg:w-5xl md:w-3xl w-11/12 h-[622px] md:h-[638px] rounded-lg p-5">
      <div className="w-full h-full md:flex block md:gap-5 items-center">
        <div className="md:w-1/2 md:block w-0 hidden h-full">
          <img
            className="h-full w-full object-contain"
            src={RegisterImage}
            alt="this is image"
          />
        </div>
        <div className="md:w-1/2 w-full">
          <h3 className="font-bold text-2xl">Sign Up</h3>
          <form action="" onSubmit={handleRegister}>
            <div className="w-full flex flex-col gap-4 mt-5">
              <Input
                Icon={<FaUserEdit size={23} />}
                name={"fullname"}
                placeholder={"Enter Full Name"}
                id={"fullname"}
                require
              />

              <Input
                Icon={<MdEmail size={23} />}
                name={"email"}
                typeInput={"email"}
                placeholder={"Enter Email"}
                id={"email"}
                require
              />
              <Input
                Icon={<IoIosLock size={23} />}
                name={"password"}
                typeInput={"password"}
                placeholder={"Enter Password"}
                id={"password"}
                require
                onChange={handleChange}
              />
              <Input
                Icon={<CiLock size={23} />}
                typeInput={"password"}
                name={"confimPassword"}
                placeholder={"Confirm Password"}
                id={"confirm-password"}
                onChange={handleChange}
                require
              />
            </div>
            <Input
              name={"terms"}
              type={"checkbox"}
              label={"I agree to all terms"}
              onChange={handleChange}
            />
            {error && <div className="text-red-500 my-1">{error}</div>}
            <div className="">
              <button
                type="submit"
                className="font-medium mt-4 text-white w-24 h-14 text-center rounded-lg cursor-pointer px-8 bg-[#FF9090] hover:bg-[#de7777] disabled:bg-gray-400 flex items-center justify-center"
                disabled={loading}
              >
                {!loading && <p>Register</p>}
                {loading && <div className="loader-auth" />}
              </button>
            </div>
            <div className="mt-4">
              <p>
                Already have an account?{" "}
                <Link to={"/auth/login"} className="text-[#008BD9]">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
