import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdPassword } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";

import toast from "react-hot-toast";

import XSvg from "../../../components/svgs/X";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isPending,
    mutate: loginMutation,
  } = useMutation({
    mutationFn: async ({ userName, password }) => {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="userName"
              onChange={handleInputChange}
              value={formData.userName}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="w-full btn rounded-full btn-primary text-white btn-outline ">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
