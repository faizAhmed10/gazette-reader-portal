import React, { useContext, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import ReaderContext from "../utils/ReaderContext";
import ScrollDirection from "./ScrollDirection";
import ConfirmPopup from "./ConfirmPopup";
import { FaBars, FaTimes } from "react-icons/fa"; 
const Navbar = () => {
  let { logout } = useContext(ReaderContext);
  const location = useLocation();
  const scrollDirection = ScrollDirection();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const route = location.pathname === "/all-articles" ? "/todays-articles" : "/all-articles";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    console.log("Logged out")
    logout();
    setIsModalOpen(false);
  };
 
  return (
    <nav className={`flex w-full bg-black text-white py-4 lg:px-10 px-2 items-center ${
      scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
    } gap-1`}>
      <ConfirmPopup
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to Logout?"
      />
      <Link to="/" className="lg:text-4xl text-3xl flex-1 text-nowrap">HKBK Gazette</Link>

      {/* Hamburger Icon (visible on mobile) */}
      <div className="lg:hidden flex">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu items */}
      <ul
        className={`fixed z-50 top-0 h-[100dvh] left-0 w-2/3 bg-black text-white pt-5 flex flex-col gap-6 items-center transform transition-transform duration-300 lg:static lg:flex-row lg:h-auto lg:w-auto lg:p-0 lg:bg-transparent lg:gap-10 lg:flex lg:items-center  ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <li>
          <NavLink
            to={route}
            className="text-white underline font-bold text-nowrap"
          >
            {route === "/all-articles" ? "All Articles" : "Today's Articles"}
          </NavLink>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-white p-2 text-black rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
