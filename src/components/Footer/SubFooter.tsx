
import SubLogo from "components/Logo/SubLogo";
import SubSocialList from "components/SocialsList/SubSocialList";
import { CustomLink } from "data/types";
import React from "react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "5",
    title: "Getting started",
    menus: [
      { href: "#", label: "Installation" },
      { href: "#", label: "Release Notes" },
      { href: "#", label: "Upgrade Guide" },
      { href: "#", label: "Browser Support" },
      { href: "#", label: "Editor Support" },
    ],
  },
  {
    id: "1",
    title: "Explore",
    menus: [
      { href: "#", label: "Design features" },
      { href: "#", label: "Prototyping" },
      { href: "#", label: "Design systems" },
      { href: "#", label: "Pricing" },
      { href: "#", label: "Customers" },
    ],
  },
  {
    id: "2",
    title: "Resources",
    menus: [
      { href: "#", label: "Best practices" },
      { href: "#", label: "Support" },
      { href: "#", label: "Developers" },
      { href: "#", label: "Learn design" },
      { href: "#", label: "What's new" },
    ],
  },
  {
    id: "4",
    title: "Community",
    menus: [
      { href: "#", label: "Discussion Forums" },
      { href: "#", label: "Code of Conduct" },
      { href: "#", label: "Community Resources" },
      { href: "#", label: "Contributing" },
      { href: "#", label: "Concurrent Mode" },
    ],
  },
];



export interface SubFooterProps {
    logo: any,
    username: string,
    menus: any
}

const SubFooter: React.FC<SubFooterProps> = ({ logo, username, menus }) => {

    const socials = menus?.filter(function(obj:any) {
        return obj.type == "Social Icon";
    }); 
  
    const navmenus = menus?.filter(function(obj:any) {
       return obj.type == "Navigation Menu";
    }); 

  const renderWidgetMenuItem = (menu: any, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
            Navigation Menu
        </h2>
        <ul className="mt-5 space-y-4">
            <li>
                <a
                target="_blank"
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={menu.link}
                >
                {menu.name}
                </a>
            </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative py-8 lg:py-8 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex lg:flex-row justify-between">
          <div className="flex ml-5">
            <SubLogo img={logo} />
          </div>
          <div className="flex mr-10 mt-5 text-semi-bold">
            Copyright &nbsp;<b>@ {username}; All rights reserved</b>
          </div>
          <div className="flex justify-end mr-10 mt-5">
            <SubSocialList socials={socials} itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
          </div>
        </div>
    </div>
  );
};

export default SubFooter;
