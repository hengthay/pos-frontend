import React, { useState } from 'react'
import { FaBell, FaSearch } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { selectUser } from '../feature/auth/authSlice'
import { BiCart } from 'react-icons/bi'
import { selectCartItems } from '../feature/cartTemp/cartTempSlice'

const NavBar = ({ sideBarOpen, onToggle, onToggleCartOpen }) => {
  // Get current logged user
  const user = useSelector(selectUser);
  const isAdmin = user?.user?.role === "admin";
  const cartQuantity = useSelector(selectCartItems);

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white border-b border-gray-200
      transition-all duration-300 shadow
      ${sideBarOpen ? "left-60" : "left-18"}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">

        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <GiHamburgerMenu size={22} />
          </button>
        </div>

        <div
          className={`hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 ${sideBarOpen ? "w-100" : "w-160"}`}
        >
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 py-1.5 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleCartOpen}
            className="md:hidden flex relative p-2 rounded-md hover:bg-gray-100">
            <BiCart size={24}/>
            <span className="absolute top-1.5 right-0.5 bg-red-500 text-white text-[10px] px-1 rounded-full">
              {cartQuantity.length}
            </span>
          </button>
          <button className="relative p-2 rounded-md hover:bg-gray-100">
            <FaBell size={18} />
            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] px-1 rounded-full">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
            <img
              src="https://picsum.photos/200/300"
              alt="profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
            />
            <div className="hidden md:block leading-tight">
              <h4 className="font-semibold">{user?.user?.name}</h4>
              <p className="text-xs text-gray-500">{isAdmin ? "Administrator" : "Cashier"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar