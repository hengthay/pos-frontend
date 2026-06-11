import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaBox, FaChartBar, FaChartLine, FaHome, FaList, 
  FaMoneyBill, FaShoppingBag, FaShoppingCart, FaTruck, FaUsers 
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiExpandUpDownLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../feature/auth/authSlice';

const SideBar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();

  const handleToggleLogout = () => setShowLogout(prev => !prev);

  // Close the logout popover automatically if the sidebar is collapsed/toggled
  useEffect(() => {
    if (!isOpen) {
      setShowLogout(false);
    }
  }, [isOpen]);

  const generalItems = [
    { id: 1, iconName: FaHome, label: "Home", pathName: "/" },
    { id: 2, iconName: FaShoppingCart, label: "Sale Order", pathName: "/sale-orders" },
    { id: 3, iconName: FaBox, label: "Inventory", pathName: "/inventories" },
    { id: 4, iconName: FaList, label: "Category", pathName: "/categories" },
    { id: 5, iconName: FaUsers, label: "Customers", pathName: "/customers" },
  ];

  const supportItems = [
    { id: 6, iconName: FaChartLine, label: "Total Sale", pathName: "/total-sales" },
    { id: 7, iconName: FaShoppingBag, label: "Purchase", pathName: "/purchases" },
    { id: 8, iconName: FaTruck, label: "Supplier", pathName: "/suppliers" },
    { id: 9, iconName: FaMoneyBill, label: "Expenses", pathName: "/expenses" },
    { id: 10, iconName: FaChartBar, label: "Reports", pathName: "/reports" },
  ];

  const handleLogout = async () => {
    try {

      await dispatch(logoutUser()).unwrap();

      Swal.fire({
        title: "Successfully",
        text: "Your logout is successfully!",
        icon: 'success',
        timer: 2000,
      });

      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Failed",
        text: "Your logout is failed!",
        icon: 'error',
        timer: 1000,
      });
    }
  };

  const year = useMemo(() => new Date().getFullYear());

  // Menu render
  const renderNavLinks = (items) => {
    return items.map((item) => {
      const Icon = item.iconName;
      const isActive = location.pathname === item.pathName;

      return (
        <li key={item.id}>
          <Link
            to={item.pathName}
            className={`group relative flex items-center ${
              isOpen ? "justify-start gap-3 px-3" : "justify-center"
            } py-2.5 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }
            `}
          >
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500" />
            )}

            <Icon
              size={15}
              className={`min-w-4.5 ${isActive ? "text-blue-500" : ""}`}
            />

            <span
              className={`whitespace-nowrap transition-all duration-200
                ${
                  isOpen
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }
              `}
            >
              {item.label}
            </span>

            {!isOpen && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50"
              >
                {item.label}
              </div>
            )}
          </Link>
        </li>
      );
    });
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-20 min-h-screen bg-mist-100 shadow 
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-60" : "w-18"}`}
      >
        <div className={`flex flex-col p-3 md:p-4 md:space-y-6 space-y-4 h-screen ${!isOpen ? "justify-center items-center" : "justify-start"}`}>
          <div className='space-y-6 w-full'>
            <div
              className={`flex items-center gap-3 ${
                isOpen ? "justify-start" : "justify-center"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>

              {isOpen && (
                <div className="opacity-100 transition-opacity duration-200">
                  <h1 className="text-blue-500 font-semibold text-lg">
                    POS System
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Inventory Management
                  </p>
                </div>
              )}
            </div>
            
            {isOpen && <hr className='text-gray-400' />}
            {/* Menu */}
            <div className="md:space-y-6 space-y-2">
              <div>
                {isOpen && (
                  <p className="uppercase tracking-[0.15em] text-[10px] font-semibold text-slate-400 px-3 mb-2">
                    General
                  </p>
                )}
                <ul className="space-y-1">
                  {renderNavLinks(generalItems)}
                </ul>
              </div>

              <div>
                {isOpen && (
                  <p className="uppercase tracking-[0.15em] text-[10px] font-semibold text-slate-400 px-3 mb-2">
                    Supports
                  </p>
                )}
                <ul className="space-y-1">
                  {renderNavLinks(supportItems)}
                </ul>
              </div>
            </div>
          </div>
          
          <div className='h-full w-full flex items-end justify-start'>
            <div className="flex relative justify-between items-center w-full shadow-sm bg-white rounded-lg p-1.5">
              {isOpen && (
                <div className='flex gap-x-2 gap-y-1 text-sm'>
                  <img
                    src="https://picsum.photos/200/300"
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="transition-all duration-300 origin-left opacity-100 scale-100">
                    <h4 className="font-semibold">Admin</h4>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              )}
              
              <div onClick={handleToggleLogout} className='cursor-pointer p-1'>
                <RiExpandUpDownLine />
              </div>

              {showLogout && (
                <div className={`absolute w-full bg-white p-2 rounded-lg shadow-md z-50 space-y-2 ${isOpen ? '-top-13 -right-47' : '-top-25 -right-50 min-w-50'}`}>
                  {!isOpen && (
                    <div className='flex items-center gap-x-2 gap-y-1'>
                      <img
                          src="https://picsum.photos/200/300"
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
                        />
                      <div className="transition-all duration-300 origin-left">
                        <h4 className="font-semibold">Admin</h4>
                        <p className="text-sm text-gray-500">Administrator</p>
                      </div>
                    </div>
                  )}
                  <hr className='text-gray-300' />
                  <button
                    onClick={handleLogout}
                    className={`flex justify-start items-center gap-2 bg-black cursor-pointer text-white
                    ${isOpen ? "px-4" : "px-3"} py-1.5 rounded-md border
                    hover:bg-transparent hover:text-black group transition w-full`}
                  >
                    <FiLogOut size={18} className="text-white group-hover:text-black" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {isOpen && (
            <p className="text-xs text-slate-500 text-center opacity-100">&copy;{year} POS System.</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;