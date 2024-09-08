import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ReaderContext from "../utils/ReaderContext"
const Home = () => {
  let {authTokens} = useContext(ReaderContext)
  return (
    <div className="background flex">
      <div className=" p-3 ml-3 my-auto flex flex-col">
        <h1 className="font-bold text-6xl ">Welcome to HKBK Gazette</h1>
        <h2 className="font-semibold text-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </h2>

        <Link to={authTokens ? "/todays-articles" : "/login"} className="block p-2 bg-black text-white rounded my-2 mx-auto text-center">
          Start Reading
        </Link>
      </div>
    </div>
  );
};

export default Home;
