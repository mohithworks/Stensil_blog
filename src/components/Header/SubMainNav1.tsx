import React, { FC } from "react";
import { Link } from "react-router-dom";
import SubLogo from "components/Logo/SubLogo";
import SubNavigation from "components/Navigation/SubNavigation";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "components/Button/ButtonPrimary";
import SubMenuBar from "components/MenuBar/SubMenuBar";
import DarkModeContainer from "containers/DarkModeContainer/DarkModeContainer";
import ErrorBoundary from "components/ErrorBoundary";
import { useGlobalContext } from 'utils/context';

export interface MainNav1Props {
  isTop?: boolean;
}

const SubMainNav1: FC<MainNav1Props> = ({ isTop }) => {
  const { author, navigation } = useGlobalContext();
  
  const navmenus = navigation?.filter(function(obj:any) {
    return obj.type == "Navigation Menu";
  }); 
  
  const buttons = navigation?.filter(function(obj:any) {
    return obj.type == "CTA Button";
  }); 

  console.log(author[0].logoimg);

  return (
    <div className={`nc-MainNav nc-MainNav1 relative z-10`}>
      <div className="container py-5 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-4 sm:space-x-10 2xl:space-x-14">
          {
            author[0].logoimg == null ? 
            
             <Link to="/" className="ttnc-logo inline-block">
              <h2 className={`text-1xl md:text-2xl font-semibold`}>{author[0].username.toUpperCase()}</h2>
             </Link>
            :
            <SubLogo img={author[0].logoimg} />
          }
          {
            navmenus.length != 0 && (<SubNavigation navigations={navmenus} />)
          }
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-1">
            <DarkModeContainer />
            <SearchDropdown />
            <div className="px-1" />
            {
          
              buttons.length != 0 && (
                <a href={buttons[0].link} target="_blank">
                 <ButtonPrimary>{buttons[0].name}</ButtonPrimary>
                </a>)
            }
          </div>
          <div className="hidden xl:flex lg:flex md:flex">
            <DarkModeContainer />
          </div>
          <div className="flex xl:hidden">
            <SearchDropdown />
          </div>
          <div className="items-center md:hidden">
            <ErrorBoundary>
              <SubMenuBar navigations={navmenus} username={author[0].username} description={author[0].description} logo={author[0].logoimg} buttons={buttons} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMainNav1;
