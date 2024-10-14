import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col w-full mt-6 gap-4 items-center justify-center bg-sky-950 py-4">
      <p className="text-neutral-400 text-sm flex gap-8">
        <a href="https://ko-fi.com/astrokuma" target="_blank" rel="noopener noreferrer" className=" text-neutral-200 hover:text-neutral-100">
          Donate ♡
        </a>
        © 2024 Astro-Kuma. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
