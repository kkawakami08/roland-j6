import React from "react";

const NoteTags = ({ notes }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {notes.map((note, index) => (
        <span key={index} className="bg-sky-950 text-white font-semibold rounded-full py-1 px-3 text-md">
          {note}
        </span>
      ))}
    </div>
  );
};

export default NoteTags;
