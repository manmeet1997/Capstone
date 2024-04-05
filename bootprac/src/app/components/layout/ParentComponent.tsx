// ParentComponent.tsx
import React, { useState } from 'react';
import Header from './Header';
import AllNews from './AllNews';

const ParentComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  return (
    <>
      <Header />
      <AllNews />
    </>
  );
};

export default ParentComponent;