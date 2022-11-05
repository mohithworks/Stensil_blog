import React, { FC, ReactNode, useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PostDataType, TaxonomyType } from "data/types";
import NcImage from "components/NcImage/NcImage";
import { SINGLE } from "data/single";
import SingleContentBlog from "./SingleContentBlog";
import { CommentType } from "components/CommentCard/CommentCard";
import { useAppDispatch } from "app/hooks";
import { changeCurrentPage } from "app/pages/pages";
import SubSingleHeader from "./SubSingleHeader";
import SingleRelatedPosts from "./SingleRelatedPosts";
import supabaseClient from "utils/supabaseClient";
import SocialsShare from "components/SocialsShare/SocialsShare";
import Avatar from "components/Avatar/Avatar";
import BookmarkContainer from "containers/BookmarkContainer/BookmarkContainer";
import PostCardLikeContainer from "containers/PostCardLikeContainer/PostCardLikeContainer";

export interface PageSingleTemplate2Props {
  className?: string;
}

export interface SinglePageType extends PostDataType {
  tags: TaxonomyType[];
  content: string | ReactNode;
  comments: CommentType[];
}

let MAIN_MENU_HEIGHT = 0;
let WIN_PREV_POSITION = window.pageYOffset;

const PageSingleTemplate2: FC<PageSingleTemplate2Props> = ({
  className = "",
}) => {
  const dispatch = useAppDispatch();

  const { authorslug, postslug } = useParams<any>();

  const [postLoading, setpostLoading] = useState(true);
  const [post, setPost] = useState<any>();
  const [error, setError] = useState<any>();

  const location = window.location.hostname.split(".")[0];
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    console.log(authorslug);
    console.log(postslug);

    const authorSlug = location != url ? location == 'stensil-blog' ? 'hrithik' : location : 'hrithik';
    console.log(authorSlug);

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('posts')
        .select(`*, authors!inner(*), category!inner(*)`)
        .eq('posttitle', postslug)
        .eq('authors.username', authorSlug)

        if(error) {
          setError(error);
        }

        if(data) {
          setPost(data);
          console.log(data);
          setpostLoading(false);
        }
    }
    fetchPost();
  }, []);

  // UPDATE CURRENTPAGE DATA IN PAGEREDUCERS
  useEffect(() => {
    dispatch(changeCurrentPage({ type: "/single/:slug", data: SINGLE }));
    return () => {
      dispatch(changeCurrentPage({ type: "/", data: {} }));
    };
  }, []);

  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  //
  //
  const locationW = useLocation();

  const showSingleMenu = locationW.pathname.search(/^\/posts/g) > -1;
  //
  const [isSingleHeaderShowing, setIsSingleHeaderShowing] = useState(false);

  useEffect(() => {
    if (!mainMenuRef.current) {
      return;
    }
    MAIN_MENU_HEIGHT = mainMenuRef.current.offsetHeight;
    window.addEventListener("scroll", handleShowHideHeaderMenuEvent);
    return () => {
      window.removeEventListener("scroll", handleShowHideHeaderMenuEvent);
    };
  }, []);

  useEffect(() => {
    if (showSingleMenu) {
      //  BECAUSE DIV HAVE TRANSITION 100ms
      setTimeout(() => {
        window.addEventListener("scroll", handleShowHideSingleHeadeEvent);
      }, 200);
    } else {
      window.removeEventListener("scroll", handleShowHideSingleHeadeEvent);
    }
    return () => {
      window.removeEventListener("scroll", handleShowHideSingleHeadeEvent);
    };
  }, [showSingleMenu]);

  const handleShowHideSingleHeadeEvent = () => {
    window.requestAnimationFrame(showHideSingleHeade);
  };
  const handleShowHideHeaderMenuEvent = () => {
    window.requestAnimationFrame(showHideHeaderMenu);
  };

  const handleProgressIndicator = () => {
    const entryContent = document.querySelector(
      "#single-entry-content"
    ) as HTMLDivElement | null;

    if (!showSingleMenu || !entryContent) {
      return;
    }

    const totalEntryH = entryContent.offsetTop + entryContent.offsetHeight-500;
    let winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    let scrolled = (winScroll / totalEntryH) * 100;
    if (!progressBarRef.current || scrolled > 140) {
      return;
    }

    scrolled = scrolled >= 100 ? 100 : scrolled;

    progressBarRef.current.style.width = scrolled + "%";
  };

  const showHideSingleHeade = () => {
    handleProgressIndicator();
    // SHOW _ HIDE SINGLE DESC MENU
    let winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > 600) {
      setIsSingleHeaderShowing(true);
    } else {
      setIsSingleHeaderShowing(false);
    }
  };

  const showHideHeaderMenu = () => {
    let currentScrollPos = window.pageYOffset;
    if (!containerRef.current || !mainMenuRef.current) return;

    if (Math.abs(WIN_PREV_POSITION - currentScrollPos) <= 50) {
      return;
    }

    // SHOW _ HIDE MAIN MENU
    if (WIN_PREV_POSITION > currentScrollPos) {
      containerRef.current.style.top = "0";
    } else {
      containerRef.current.style.top = `-${MAIN_MENU_HEIGHT + 2}px`;
    }

    WIN_PREV_POSITION = currentScrollPos;
  };

  const getTitle = () => {
    const titleR = locationW.pathname.split('/')[2].replace(/-/g, ' ').toUpperCase();
    console.log(titleR);
    return 'ABout'
  }

  const renderSingleHeader = () => {
    if (!isSingleHeaderShowing) return null;
    const { title, authors } = post[0];
    return (
      <div className="nc-SingleHeaderMenu dark relative py-4 bg-neutral-900 dark:bg-neutral-900">
        <div className="container">
          <div className="flex">
            <div className="flex items-center mr-3">
              <Avatar
                imgUrl={authors.avatar_url}
                userName={authors.full_name}
                sizeClass="w-8 h-8 text-lg"
                radius="rounded-full"
              />
              <h3 className="ml-4 text-lg line-clamp-1 text-neutral-100">
                {title}
              </h3>
            </div>

            {/* ACTION */}
            <div className="flex items-center space-x-2 text-neutral-800 sm:space-x-3 dark:text-neutral-100">
              {/* <PostCardLikeContainer postId={SINGLE.id} like={SINGLE.like} />
              <BookmarkContainer
                initBookmarked={bookmark.isBookmarked}
                postId={id}
              />
              <div className="border-l border-neutral-300 dark:border-neutral-700 h-6"></div>
              <SocialsShare
                className="flex space-x-2"
                itemClass="w-8 h-8 bg-neutral-100 text-lg dark:bg-neutral-800 dark:text-neutral-300"
              /> */}
            </div>
          </div>
        </div>
        <div className="absolute top-full left-0 w-full progress-container h-[5px] bg-neutral-300 overflow-hidden">
          <div
            ref={progressBarRef}
            className="progress-bar h-[5px] w-0 bg-teal-600"
          />
        </div>
      </div>
    );
  };

  if(error) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar relative text-center pt-40 pb-40 lg:pt-40 lg:pb-40 ${className}`}
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

  }else if(postLoading == true) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar text-center pt-40 pb-40 lg:pt-40 lg:pb-40 ${className}`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
          <div className="container relative">
            {/* HEADER */}
            <header className="text-center max-w-2xl mx-auto space-y-7">
              <h2 className="text-7xl md:text-8xl"></h2>
              <h1 className="text-3xl md:text-6xl font-semibold tracking-widest">
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
          className={`nc-PageSingleTemp4Sidebar text-center pt-30 pb-30 lg:pt-40 lg:pb-40 ${className}`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
            <div className="container relative py-16 lg:py-20">
              {/* HEADER */}
              <header className="text-center max-w-2xl mx-auto space-y-7">
                <h2 className="text-6xl md:text-8xl">🪔</h2>
                <h1 className="text-6xl md:text-9xl font-semibold tracking-widest">
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
          className="nc-SingleHeaderMenu sticky top-0 w-full left-0 right-0 z-40 transition-all "
        >
          {/* RENDER MAIN NAVIGATION */}
          {showSingleMenu && renderSingleHeader()}

          {/* RENDER PROGESSBAR FOR SINGLE PAGE */}
        </div>
        <div
          className={`nc-PageSingleTemplate2 pt-8 lg:pt-16 ${className}`}
          data-nc-id="PageSingleTemplate2"
          ref={containerRef}
        >
          <div ref={mainMenuRef}>
            {/* SINGLE HEADER */}
            <header className="container rounded-xl">
              <div className="max-w-screen-md mx-auto">
                <SubSingleHeader hiddenDesc pageData={post[0]} />
              </div>
            </header>
    
            {/* FEATURED IMAGE */}
            <div className="">
              <NcImage
                containerClassName="my-10 sm:my-12 relative aspect-w-16 aspect-h-12 md:aspect-h-9 lg:aspect-h-6"
                className="absolute inset-0 object-cover w-full h-full"
                src={post[0].featured_imghd}
              />
            </div>
            {/* SINGLE MAIN CONTENT */}
            <div className="container">
              <SingleContentBlog data={post[0].post} />
            </div>
    
            {/* RELATED POSTS */}
            <SingleRelatedPosts category={post[0].category.id} postTitle={post[0].posttitle} />
          </div>
        </div>
      </>
    );

  }
};

export default PageSingleTemplate2;
