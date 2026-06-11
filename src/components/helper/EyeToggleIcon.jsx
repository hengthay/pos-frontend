import React from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const EyeToggleIcon = ({ isChecked, onClick, shouldPasswordLabelFloat}) => {
  return (
    <button
      type='button'
      aria-label={isChecked ? "Hide Password" : "Show Password"}
      onClick={onClick}
      className='cursor-pointer'
      >
        {
        isChecked ? (
            // Open eye
            <FaRegEye 
              onFocus={() => handleFocus('password')}
              size={20} className={`absolute top-4 right-2 transition-colors ease-linear duration-300 ${shouldPasswordLabelFloat ? 'text-cyan-600' : 'text-gray-500'}`}
              />) :
              (
            // Closed eye
            <FaRegEyeSlash 
              onFocus={() => handleFocus('password')}
              size={20} className={`absolute top-4 right-2 transition-colors ease-linear duration-300 ${shouldPasswordLabelFloat ? 'text-cyan-600' : 'text-gray-500'}`}/>
              )
        }
    </button>
  )
}

export default EyeToggleIcon