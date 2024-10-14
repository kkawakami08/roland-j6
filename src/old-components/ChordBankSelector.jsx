import React, { useState } from "react";

const ChordBankSelector = ({ chords = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!chords || chords.length === 0) {
    console.warn("No chords provided to ChordBankSelector");
    return null;
  }

  const handleSelectChange = (index) => {
    setSelectedIndex(index);
    onChange(chords[index].number);
  };

  const handleIncrement = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % chords.length);
    onChange(chords[(selectedIndex + 1) % chords.length].number);
  };

  const handleDecrement = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + chords.length) % chords.length);
    onChange(chords[(selectedIndex - 1 + chords.length) % chords.length].number);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-sky-950 text-white shadow-md rounded-lg h-24 px-3 border-none">
      <div className="flex justify-between w-full items-center">
        <button className="px-4 py-2 bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm" onClick={handleDecrement}>
          -
        </button>
        <span className="font-medium tracking-wide">PRESET</span>
        <button className="px-4 py-2 bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm" onClick={handleIncrement}>
          +
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={selectedIndex}
          onChange={(e) => handleSelectChange(parseInt(e.target.value))}
          className="bg-gray-950 rounded-lg px-3 py-2 shadow-sm focus:outline-none appearance-none pl-4 pr-8"
          style={{
            backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'><path d='M1.5 4.5l7 7 7-7z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "calc(100% - 1rem) center",
            backgroundSize: "1rem",
          }}
        >
          {chords.map((chart, index) => (
            <option key={chart.number} value={index}>
              {chart.number}: {chart.genre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChordBankSelector;
