import React, { ChangeEvent } from 'react';
import './layout.css';
type SearchProps = {
  onFilter: (searchTerm: string) => void;
};

const Search: React.FC<SearchProps> = ({ onFilter }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    onFilter(searchTerm); // Call the onFilter function passed through props
  };
  
  return (
    <div className='search-container'>
      <input
        className='flex-grow p-2 mr-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500'
        type='text'
        placeholder='Search here...'
        onChange={handleChange}
      />
      <button
        className='custom-btn'>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        Search
      </button>
    </div>
  );
};

export default Search;
