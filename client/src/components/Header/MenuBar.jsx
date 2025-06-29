import React from "react";
import { Link, NavLink } from "react-router";

export default function MenuBar() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-300 shadow z-50">
      <div className="flex justify-around items-center py-2">
        
    
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center ${isActive ? "text-red-600" : "text-white"}  hover:text-red-600`}>
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-xs">Home</span>
        </NavLink>

      
        <NavLink to="/subscription" className={({isActive})=>`flex flex-col items-center ${isActive ? "text-red-600" : "text-white"} hover:text-red-600`}>
          <i className="fas fa-photo-video text-xl"></i>
          <span className="text-xs">Subscriptions</span>
        </NavLink>

        <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center ${isActive ? "text-red-600" : "text-white"} hover:text-red-600`}>
          <i className="fas fa-user-circle text-xl"></i>
          <span className="text-xs">You</span>
        </NavLink>
      </div>
    </nav>
    </>
  );
}
