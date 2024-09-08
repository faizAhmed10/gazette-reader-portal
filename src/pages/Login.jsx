import React, { useContext } from "react";
import ReaderContext from "../utils/ReaderContext";
import { Link } from "react-router-dom";
import Loader from "../utils/Loader"
const Login = () => {
  let { login, loading } = useContext(ReaderContext);

  return (
    <div
      className="flex items-center justify-center min-h-[100dvh]
    background flex-col"
    >
      {loading && <Loader/>}
      <form
        onSubmit={login}
        className="flex flex-col mx-auto
        items-center p-4 bg-black bg-opacity-20 text-black rounded 
        "
      >
        <h2 className="text-3xl font-bold my-1">Login</h2>

        <div className="flex flex-col my-2">
          <label htmlFor="Username" className="font-bold">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="bg-transparent outline outline-1 outline-black rounded font-bold ufdb"
            id="Username"
            placeholder="user_name"
            required
            minLength={8}
          />
        </div>

        <div className="flex flex-col my-2">
          <label htmlFor="Password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="bg-transparent rounded font-bold ufdb outline outline-1 outline-black"
            id="Password"
            placeholder="********"
            required
            minLength={8}
          />
        </div>
        {!loading && <button type="submit" className="p-2 rounded my-2 bg-black text-white">
          Login
        </button>}
        <p className="font-bold">
          Not a member yet?{" "}
          <Link to="/register" className="text-blue-900 font-bold underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
