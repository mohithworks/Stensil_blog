import SubSocialList from "components/SocialsList/SubSocialList";
import { CustomLink } from "data/types";
import React from "react";
import { renderLogo } from "components/Header/SubMainNav1";

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
    menus: any,
    authors: any,
}

const SubFooter: React.FC<SubFooterProps> = ({ authors, menus }) => {

    console.log(authors)
    const socials = menus.length > 0 ? menus[0]['social_icons'] : [];

  return (
    <div className="nc-Footer relative py-8 lg:py-8 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col items-center text-center justify-center md:flex-row md:justify-between">
          <div className="flex md:ml-5">
            {renderLogo(authors)}
          </div>
          <p className="mt-5 text-sm px-5 md:mr-5 md:px-0">Copyright&nbsp;<span className="font-semibold">© 2022, {authors[0].metatitle}. All rights reserved</span></p>
          {
            menus.length > 0 && socials.length > 0 && 
            <div className="flex mt-5 mr-0 md:mr-10">
              <SubSocialList socials={socials} itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200 text-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200" />
            </div>
          }
        </div>
    </div>
  );
};

export default SubFooter;
