// Import useContext from react
"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext, { AuthContextType } from "@/context/AuthContext"; // Import AuthContext
import Search from "@/app/components/layout/Search";

interface Article {
  title: string;
  description: string;
  author: string;
  url: string;
  _id: string;
  category: string;
  content: string;
  summary: string;
  urlToImage: string | null;
  publishedAt: Date;
}

interface AllNewsProps {}

const AllNews: React.FC<AllNewsProps> = () => {
  const authContext = useContext(AuthContext); // Retrieve auth context

  const [mynews, setMyNews] = useState<Article[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        category
          ? `http://localhost:3001/api/news/category/${category}`
          : "http://localhost:3001/api/news"
      );
      setMyNews(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  useEffect(() => {
    // Filter news based on searchTerm if it's not empty
    if (searchTerm.trim() !== "") {
      const filteredNews = mynews.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMyNews(filteredNews);
    } else {
      // If searchTerm is empty, fetch all news again
      fetchData();
    }
  }, [searchTerm]);

  const formatPublishedDate = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Default image URL
  const defaultImageUrl = "/news1.jpg";

  return (
    <>
      <div className="container">
        <Search onFilter={setSearchTerm} />
        <Navbar onCategoryChange={handleCategoryChange} />
        <div className="grid">
          {mynews.map((ele: Article, index: number) => (
            <div
              key={index}
              className="mt-8 max-w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition duration-150 ease-out hover:scale-105 flex flex-col"
            >
              <a href={ele.url}>
                {ele.urlToImage ? (
                  <img
                    className="w-full h-56 rounded-t-lg"
                    src={ele.urlToImage}
                    alt={ele.title}
                  />
                ) : (
                  <img
                    className="w-full h-56 rounded-t-lg"
                    src={defaultImageUrl}
                    alt="Default Image"
                  />
                )}
              </a>

              <div className="p-5 pb-0 flex-grow">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500">
                  {ele.title}
                </h5>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {ele.description}
                </p>
              </div>

              <span className="mx-5 mb-5">
                <div className="py-2 flex justify-between items-center">
                  <p className="text-gray-500">
                    {ele.author ? `By ${ele.author}` : "Anonymous"}
                  </p>
                  <p className="text-gray-500 leading-none whitespace-nowrap">
                    {formatPublishedDate(ele.publishedAt)}
                  </p>
                </div>
                {authContext && (
                  <a
                    href={authContext.isLoggedIn ? `/id/${ele._id}` : "/login"}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {authContext.isLoggedIn
                      ? "Read more"
                      : "Login to read more"}

                    <svg
                      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

interface NavbarProps {
  onCategoryChange: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCategoryChange }) => {
  const categories = [
    "health",
    "science",
    "entertainment",
    "business",
    "sports",
  ];

  return (
    <nav className="mt-4 flex justify-center flex-col sm:flex-row items-center gap-8 text-gray-500 font-semibold">
      {categories.map((category, index) => (
        <div
          key={index}
          className="button hover:text-orange-500 cursor-pointer"
          onClick={() => onCategoryChange(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
      ))}
    </nav>
  );
};

export default AllNews;
