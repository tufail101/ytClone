import React, { useState } from "react";
import ytLogo from "../../assets/ytLogo.png";
import { useNavigate } from "react-router";

export default function SearchBar() {
    const [search ,setSearch] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
             navigate(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    } 


  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] text-white w-full shadow-md">
        <div className="flex items-center gap-2">
          <img src={ytLogo} alt="YouTube Logo" className="h-6" />
          <span className="text-lg font-semibold hidden sm:block">YouTube</span>
        </div>

        
          <form action="" className="flex items-center w-full max-w-xl mx-4" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-[#121212] text-white border border-[#303030] rounded-l-full focus:outline-none focus:ring-1 focus:ring-red-600 placeholder:text-gray-400"
            />
            <button className="px-4 py-2 bg-[#222] border border-[#303030] border-l-0 rounded-r-full hover:bg-[#333]">
              <i className="fas fa-search text-gray-300"></i>
            </button>
          </form>
        

        <div className="hidden sm:block">
          <button className="p-2 rounded-full hover:bg-[#222]">
            <i className="fas fa-microphone text-gray-300 text-lg"></i>
          </button>
        </div>
      </header>
    </>
  );
}
