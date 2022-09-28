import CardLarge1 from "components/CardLarge1/CardLarge1";
import SubCardLarge1 from "components/CardLarge1/SubCardLarge1";
import Heading from "components/Heading/Heading";
import { PostDataType } from "data/types";
import React, { FC, useState } from "react";

export interface SectionLargeSliderProps {
  className?: string;
  heading?: string;
  desc?: string;
  posts: PostDataType[];
  type?: any,
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  posts,
  heading = "Editor's pick",
  desc = "Discover the most outstanding articles in all topics of life. ",
  type = "default",
  className = "",
}) => {
  const [indexActive, setIndexActive] = useState(0);
  const authorPosts:any = posts;

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= posts.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return posts.length - 1;
      }
      return state - 1;
    });
  };

  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      <div className="text-center">
        {!!heading && <Heading desc={desc}>{heading}</Heading>}
      </div>
      {authorPosts != undefined && posts.map((item, index) => {
        if (indexActive !== index) return null;
        return type === "default" ? (
          <CardLarge1
            key={index}
            onClickNext={handleClickNext}
            onClickPrev={handleClickPrev}
            post={item}
          />
        ) : (
          <SubCardLarge1
            key={index}
            postLength={posts.length}
            onClickNext={handleClickNext}
            onClickPrev={handleClickPrev}
            post={item}
          />
        );
      })}
    </div>
  );
};

export default SectionLargeSlider;
