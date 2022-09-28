import { SocialType } from "components/SocialsShare/SocialsShare";
import React, { FC } from "react";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: any;
}

const SubSocialList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block",
  socials,
}) => {
  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials.map((item:any, i:any) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <i className={item.name}></i>
        </a>
      ))}
    </nav>
  );
};

export default SubSocialList;
