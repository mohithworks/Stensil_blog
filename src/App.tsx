import React from "react";
import {SubDomainRoutes, MainRoute} from "routers/index";

function App() {
  const location = window.location.hostname.split(".")[0];
  const url = import.meta.env.VITE_URL;

  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      {
        location != url ? <SubDomainRoutes /> : <MainRoute />
      }
    </div>
  );
}

export default App;
