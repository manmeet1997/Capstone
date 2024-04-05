import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
};

const ButtonComponent = ({ children, onClick, style }: ButtonProps) => {
  return (
    <div className="p-2">
      <button
        className="inline-block px-4 py-2 rounded-lg font-bold text-base text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out"
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonComponent;
