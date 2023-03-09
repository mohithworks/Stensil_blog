import React, { useEffect, FC } from "react";
import { SubDomainRoutes, MainRoute } from "routers/index";
import Plausible from 'plausible-tracker';

export interface AppProps {
  data?: any;
}

const App: FC<AppProps> = ({ data = "" }) => {

  const { authors } = data;

  console.log(authors);

  var plausible:any;

  if(authors[0].prev_name === null) {

    plausible = Plausible({
      domain: window.location.hostname,
      trackLocalhost: true
    })

  }else {
      
    plausible = Plausible({
      domain: authors[0].prev_name + "." + import.meta.env.VITE_SITE,
      trackLocalhost: true
    })
  
  }
  
  useEffect(() => {
    plausible.enableAutoPageviews();
  }, []);

  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <SubDomainRoutes data={data} />
    </div>
  );
}

export default App;
