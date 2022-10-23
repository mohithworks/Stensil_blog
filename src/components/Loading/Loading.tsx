import React from "react";

const Loading = () => { 
 return (
    <div
      className={`nc-PageSingleTemp4Sidebar text-center pt-10 lg:pt-16`}
      data-nc-id="PageSingleTemp4Sidebar"
    >
      {/*  */}
      
      <div className="container relative py-7 lg:py-5">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-7xl md:text-8xl"></h2>
          <h1 className="text-2xl md:text-2xl font-semibold tracking-widest">
            LOADING....
          </h1>
          <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          </span>
        </header>
      </div>
    </div>
 )
}

export default Loading;