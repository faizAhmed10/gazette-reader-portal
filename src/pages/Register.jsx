import React, { useContext } from "react";
import ReaderContext from "../utils/ReaderContext";
import { Link } from "react-router-dom";
import Loader from "../utils/Loader"


const Register = () => {
  let { registerReader, loading } = useContext(ReaderContext);

  return (
    <div
      className="flex items-center justify-center min-h-[100dvh]
    background  flex-col  "
    >

      {loading && <Loader/>}
      <form
        onSubmit={registerReader}
        className="flex flex-col mx-auto
        items-center p-4 bg-black bg-opacity-20 text-black rounded
        "
      >
        <h2 className="text-3xl font-bold my-1">Register</h2>

        <div className="flex flex-col my-2">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="bg-transparent border rounded ufdb"
            id="email"
            placeholder="email@mail.com"
            required
          />
        </div>

        <div className="flex flex-col my-2">
          <label htmlFor="Username" className="font-bold">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="bg-transparent border rounded ufdb"
            id="Username"
            minLength={8}
            placeholder="(8 characters minimum)"
            required
          />
        </div>

        <div className="flex flex-col my-2">
          <label htmlFor="Password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="bg-transparent border rounded ufdb"
            id="Password"
            placeholder="********"
            required
            minLength={8}
          />
        </div>

        <div className="flex flex-col my-2">
          <label htmlFor="ConfirmPassword" className="font-bold">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmpassword"
            className="bg-transparent border rounded ufdb"
            id="ConfirmPassword"
            required
            placeholder="********"
            minLength={8}
          />
        </div>
        {!loading && <button type="submit" className="p-2 rounded my-2 bg-black text-white">
          Register
        </button>}
        <p className="font-bold">
          Already a member?{" "}
          <Link to="/login" className="text-blue-900 font-bold underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
