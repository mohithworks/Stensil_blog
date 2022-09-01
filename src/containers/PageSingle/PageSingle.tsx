import React, { FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostDataType, TaxonomyType } from "data/types";
import NcImage from "components/NcImage/NcImage";
import { SINGLE } from "data/single";
import SingleContentBlog from "./SingleContentBlog";
import { CommentType } from "components/CommentCard/CommentCard";
import { useAppDispatch } from "app/hooks";
import { changeCurrentPage } from "app/pages/pages";
import SingleHeader from "./SingleHeader";
import SingleRelatedPosts from "./SingleRelatedPosts";
import supabaseClient from "utils/supabaseClient";

export interface PageSingleProps {
  className?: string;
}

export interface SinglePageType extends PostDataType {
  tags: TaxonomyType[];
  content: string | ReactNode;
  comments: CommentType[];
}

const PageSingle: FC<PageSingleProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch();

  const { authorslug, postslug } = useParams<any>();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    console.log(authorslug);
    console.log(postslug);

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('posts')
        .select(`*, authors(*)`)
        .eq('posttitle', postslug)
        .eq('postedby', authorslug)

        if(error) {
          setError(error);
        }

        if(data) {
          setPost(data);
          console.log(data);
          setLoading(false);
        }
    }
    fetchPost();
  }, []);

  useEffect(() => {
    // UPDATE CURRENTPAGE DATA IN PAGE-REDUCERS
    dispatch(changeCurrentPage({ type: "/single/:slug", data: SINGLE }));

    return () => {
      dispatch(changeCurrentPage({ type: "/", data: {} }));
    };
  }, []);

  if(error) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar relative text-center pt-10 lg:pt-16 ${className}`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
            <div className="container relative py-16 lg:py-20">
              {/* HEADER */}
              <header className="text-center max-w-2xl mx-auto space-y-7">
                <h2 className="text-7xl md:text-8xl"></h2>
                <h1 className="text-8xl md:text-9xl font-semibold tracking-widest">
                  ERROR
                </h1>
                <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                  Please check your internet connection & refresh the page
                </span>
              </header>
            </div>
        </div>
      </>
    );

  }else if(loading) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar relative text-center pt-10 lg:pt-16 ${className}`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
          <div className="container relative py-16 lg:py-20">
            {/* HEADER */}
            <header className="text-center max-w-2xl mx-auto space-y-7">
              <h2 className="text-7xl md:text-8xl"></h2>
              <h1 className="text-6xl md:text-6xl font-semibold tracking-widest">
                LOADING....
              </h1>
              <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
              </span>
            </header>
          </div>
        </div>
      </>
    );

  }else if(!post[0]) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar relative text-center pt-10 lg:pt-16 ${className}`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
            <div className="container relative py-16 lg:py-20">
              {/* HEADER */}
              <header className="text-center max-w-2xl mx-auto space-y-7">
                <h2 className="text-7xl md:text-8xl">🪔</h2>
                <h1 className="text-8xl md:text-9xl font-semibold tracking-widest">
                  404
                </h1>
                <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                  THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.{" "}
                </span>
              </header>
            </div>
        </div>
      </>
    );

  }else { 

    return (
      <>
        <div
          className={`nc-PageSingle pt-8 lg:pt-16 ${className}`}
          data-nc-id="PageSingle"
        >
          {/* SINGLE HEADER */}
          <header className="container rounded-xl">
            <div className="max-w-screen-md mx-auto">
              <SingleHeader pageData={post[0]} />
            </div>
          </header>
  
          {/* FEATURED IMAGE */}
          <NcImage
            containerClassName="container my-10 sm:my-12"
            className="object-cover w-full h-full rounded-xl"
            src={post[0].featured_imghd}
          />
  
          {/* SINGLE MAIN CONTENT */}
          <div className="container">
            <SingleContentBlog data={post[0].post} />
          </div>
  
          {/* RELATED POSTS */}
          {/* <SingleRelatedPosts /> */}
        </div>
      </>
    );

  }
};

export default PageSingle;
