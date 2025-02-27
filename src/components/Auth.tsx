import React, { useEffect, useState } from "react";
import { AuthType } from "../types/enums";
import { FormState, SignInData, SignUpData } from "../types/types";
import { validateSignIn, validateSignUp } from "../utils/validation/validate";
import axiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { useAppDispatch } from "../Redux/Hook";
import { setUser } from "../Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth: React.FC = () => {
  const { SIGN_IN, SIGN_UP } = AuthType;
  const [authType, setAuthType] = useState<AuthType>(() => {
    const type =
      localStorage.getItem("authType") === "signIn" ? SIGN_IN : SIGN_UP;
    return type;
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signUpState, setSignUpState] = useState<FormState<SignUpData>>({
    data: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    },
    errors: {},
  });

  const [signInState, setSignInState] = useState<FormState<SignInData>>({
    data: {
      email: "",
      password: "",
    },
    errors: {},
  });
  useEffect(() => {
    setSignUpState({
      data: {
        fname: "",
        lname: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      },
      errors: {},
    });

    setSignInState({
      data: {
        email: "",
        password: "",
      },
      errors: {},
    });
    let type = authType == SIGN_IN ? "signIn" : "signUp";
    localStorage.setItem("authType", type);
  }, [authType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (authType === SIGN_IN) {
      setSignInState((prev) => {
        const updatedState = {
          ...prev,
          data: {
            ...prev.data,
            [name]: value,
          },
        };
        const errors = validateSignIn(updatedState.data);
        return { ...updatedState, errors };
      });
    } else {
      setSignUpState((prev) => {
        const updatedData = {
          ...prev.data,
          [name]: value,
        };
        const errors = validateSignUp(updatedData);

        return {
          ...prev,
          data: updatedData,
          errors,
        };
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;
    if (authType === SIGN_IN) {
      const errors = validateSignIn(signInState.data);
      setSignInState((prev) => ({ ...prev, errors }));
      if (Object.keys(errors).length === 0) {
        try {
          response = await axiosInstance.post("/signin", {
            email: signInState?.data?.email,
            password: signInState?.data?.password,
          });
          dispatch(setUser(response.data?.data));
          navigate("/home");
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              toast.error(error.response.data?.message || "Sign-in failed");
            } else if (error.request) {
              toast.error("Network error: Unable to connect to the server");
            } else {
              toast.error(error.message || "An unexpected error occurred");
            }
          } else {
            toast.error("An unknown error occurred");
          }
        }
      }
    } else {
      const errors = validateSignUp(signUpState.data);
      setSignUpState((prev) => ({ ...prev, errors }));
      if (Object.keys(errors).length === 0) {
        try {
          response = await axiosInstance.post("/signup", {
            fname: signUpState.data?.fname,
            lname: signUpState.data?.lname,
            email: signUpState.data?.email,
            role: signUpState.data?.role,
            phone: signUpState.data?.phone,
            password: signUpState.data?.password,
          });
          if (response.data?.success) {
            toast.success(response.data?.message || "Login success");
            let email = signUpState.data.email
            setAuthType(SIGN_IN)
            // console.log('after auth staet')
            // console.log(email)
            setSignInState((prev) => ({
              ...prev,
              data: {
                email,
                password: "",
              },
            }));
          } else {
            throw new Error(response.data?.message || "signup failed");
          }
        } catch (error: any) {
          toast.error(error?.message || "Signup Failed");
        }
      }
    }
  };

  return authType === SIGN_UP ? (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
              Create an account
            </h1>
            <form
              onSubmit={(e) => handleFormSubmit(e)}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex gap-4">
                <div>
                  <label
                    htmlFor="fName"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    value={signUpState?.data?.fname}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    placeholder="Enter your FirstName"
                    className=" border  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {signUpState?.errors?.fname}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="lname"
                    className="block mb-2 text-sm font-medium  text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    value={signUpState?.data?.lname}
                    placeholder="Enter your LastName"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    className=" border  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {signUpState?.errors?.lname}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={signUpState?.data?.email}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  id="email"
                  className=" border  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {signUpState?.errors?.email}
                </p>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Phone number
                </label>
                <input
                  type="phone"
                  name="phone"
                  value={signUpState?.data?.phone}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  id="phone"
                  placeholder="Enter your phone number"
                  className=" border   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {signUpState?.errors?.phone}
                </p>
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Select Role
                </label>
                <select
                  name="role"
                  id="role"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className=" border text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={signUpState?.data?.role} disabled selected>
                    Select your role
                  </option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-red-500 text-sm mt-1">
                  {signUpState?.errors?.role}
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={signUpState?.data?.password}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  placeholder="••••••••"
                  className="border text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {signUpState?.errors?.password}
                </p>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light  text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setAuthType(SIGN_IN);
                  }}
                  className="cursor-pointer font-medium text-primary-600 hover:underline text-primary-500"
                >
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className=" bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
              Sign in to your account
            </h1>
            <form
              onSubmit={(e) => handleFormSubmit(e)}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={signInState?.data?.email}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className=" border  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {signInState.errors.email}
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium  text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={signInState?.data?.password}
                  id="password"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  placeholder="••••••••"
                  className=" border  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-red-500 text-sm mt-1">
                  {signInState.errors.password}
                </p>
              </div>
              <button
                type="submit"
                className="w-full  text-white bg-blue-700 hover:bg-blue-500  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light  text-gray-400">
                Don’t have an account yet?{" "}
                <span
                  onClick={() => {
                    setAuthType(SIGN_UP);
                  }}
                  className="cursor-pointer font-medium text-primary-600 hover:underline text-primary-500"
                >
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
