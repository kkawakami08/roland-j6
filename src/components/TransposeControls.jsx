import React from "react";

const TransposeControls = ({ onTranspose, displayTransposition }) => {
  const Button = ({ children, onClick, className = "" }) => (
    <button className={`px-4 py-2 bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm ${className}`} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center h-24 gap-2 bg-sky-950 text-white shadow-md rounded-lg p-3">
      <span className="font-medium tracking-wide">TRANSPOSE</span>
      <div className="flex items-center gap-4">
        <Button onClick={() => onTranspose(-1)}>-</Button>
        <span className="font-medium">{displayTransposition}</span>
        <Button onClick={() => onTranspose(1)}>+</Button>
      </div>
    </div>
  );
};

export default TransposeControls;
