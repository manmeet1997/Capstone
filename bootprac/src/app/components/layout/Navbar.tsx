"use client"
import React from "react";
import Link from "next/link";
import axios from "axios";

const categories = ["health", "science", "entertainment","buisness","sports"];

const Navbar = () => {
  const fetchCategoryNews = async (category: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news/category/${category}`);
      console.log(`News for category ${category}:`, response.data);
      // Handle setting news data state in the parent component (e.g., AllNews)
    } catch (error) {
      console.error(`Error fetching news for category ${category}:`, error);
    }
  };

  return (
    <nav className="mt-4 flex justify-center flex-col sm:flex-row items-center gap-8 text-gray-500 font-semibold">
      {categories.map((category, index) => (
        <NavItem key={index} category={category} onClick={fetchCategoryNews} />
      ))}
    </nav>
  );
};

interface NavItemProps {
  category: string;
  onClick: (category: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ category, onClick }) => {
  const handleClick = () => {
    onClick(category);
  };

  return (
    <button className="button hover:text-orange-500 cursor-pointer" onClick={handleClick}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  );
};

export default Navbar;
