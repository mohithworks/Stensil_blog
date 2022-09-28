import React, { FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalCategories from "./ModalCategories";
import ModalTags from "./ModalTags";
import { DEMO_POSTS } from "data/posts";
import { PostDataType, TaxonomyType } from "data/types";
import { DEMO_CATEGORIES, DEMO_TAGS } from "data/taxonomies";
import PostPagination from "components/Pagination/PostPagination";
import ButtonPrimary from "components/Button/ButtonPrimary";
import ArchiveFilterListBox from "components/ArchiveFilterListBox/ArchiveFilterListBox";
import { Helmet } from "react-helmet";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import NcImage from "components/NcImage/NcImage";
import Card20 from "components/Card20/Card20";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionGridCategoryBox from "components/SectionGridCategoryBox/SectionGridCategoryBox";
import ButtonSecondary from "components/Button/ButtonSecondary";
import SectionSliderNewAuthors from "components/SectionSliderNewAthors/SectionSliderNewAuthors";
import { DEMO_AUTHORS } from "data/authors";
import supabaseClient from "utils/supabaseClient";

export interface PageArchiveProps {
  className?: string;
}

// Tag and category have same data type - we will use one demo data
const posts: PostDataType[] = DEMO_POSTS.filter((_, i) => i < 16);

const PageArchive: FC<PageArchiveProps> = ({ className = "" }) => {
  const PAGE_DATA: TaxonomyType = DEMO_CATEGORIES[0];

  const { authorslug, categoryslug } = useParams<any>();

  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<any>();
  const [post, setPost] = useState<any>();
  const [category, setCategory] = useState<any>();
  const [error, setError] = useState<any>();
  const [currentPage, setcurrentPage] = useState<any>(1);
  const [postsperPage, setpostsperPage] = useState<any>(10);

  const location = window.location.hostname.split(".")[0];
  const url = import.meta.env.VITE_URL;

  const FILTERS = [
    { name: "Most Recent" },
    { name: "Curated by Admin" },
    { name: "Most Appreciated" },
    { name: "Most Discussed" },
    { name: "Most Viewed" },
  ];

  useEffect(() => {
    console.log(authorslug);
    console.log(categoryslug);

    const author = location != url ? location : authorslug;
    console.log(author);

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, category!inner(*), authors!inner(*)')
        .eq('authors.username', author)
        .eq('category.title', categoryslug)

        if(error) {
          setError(error);
        }

        if(data?.length == 0) {
          setPost([]);
          const { data, error } = await supabaseClient
            .from('category')
            .select(`*, authors!inner(*)`)
            .eq('title', categoryslug)
            .eq('authors.username', authorslug)
            if(error) {
              setError(error);
            }
            if(data) {
              console.log(data);
              setCategory(data[0]);
              setLoading(false);

            }
        }else if(data) {
          setPost(data);
          setAuthor(data[0].authors);
          setCategory(data[0].category);
          console.log(data);
          setLoading(false);
        }
    }
    fetchPost();
  }, []);

  
  const href = (post: any) => { return location != url ? post.href : author.username+post.href; }

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
                <h1 className="text-7xl md:text-7xl font-semibold tracking-widest">
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
          className={`nc-PageSingleTemp4Sidebar relative text-center pb-50 lg:pt-40 pb-40 ${className}`}
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

  }else if(!category) {

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
    const lastIndex = currentPage * postsperPage;
    const firstIndex = lastIndex - postsperPage;
    const currentPosts = post.slice(firstIndex, lastIndex);


    return (
      <div
        className={`nc-PageArchive overflow-hidden ${className}`}
        data-nc-id="PageArchive"
      >
        <Helmet>
          <title>Archive || Blog Magazine React Template</title>
        </Helmet>
  
        {/* HEADER */}
        <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
          <div className="rounded-3xl md:rounded-[40px] relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 overflow-hidden ">
            <NcImage
              containerClassName="absolute inset-0"
              src={category.featured_imghd}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
              <h2 className="inline-block align-middle text-5xl font-semibold md:text-7xl ">
                {category.name}
              </h2>
              
              <span className="block mt-4 text-neutral-300">
                {category.posts} Posts
              </span>
            
            </div>
          </div>
        </div>
        {/* ====================== END HEADER ====================== */}
        {
          
          post.length === 0 ? (
            <div className="container py-16 text-center">
              <h1 className="text-3xl md:text-3xl font-semibold tracking-widest">
                NO POSTS
              </h1>
            </div>
          ) : (
            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
              <div>
                <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row">
                  <div className="flex space-x-2.5">
                    <ModalCategories categories={DEMO_CATEGORIES} />
                    <ModalTags tags={DEMO_TAGS} />
                  </div>
                  <div className="block my-4 border-b w-full border-neutral-100 sm:hidden"></div>
                  <div className="flex justify-end">
                    <ArchiveFilterListBox lists={FILTERS} />
                  </div>
                </div>
      
                {/* LOOP ITEMS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                  {
                    currentPosts.map((post:any, index:any) => (
                      <Card20 key={index} post={post} postHref={'../'+'../'+href(post)} />
                    ))
                  }
                </div>
      
                {/* PAGINATIONS */}
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <PostPagination totalPosts={post.length} postsperPage={postsperPage} currentPage={currentPage} setcurrentPage={setcurrentPage} />
                </div>
              </div>
      
              {/* MORE SECTIONS */}
              {/* === SECTION 5 === */}
              {/* <div className="relative py-16">
                <BackgroundSection />
                <SectionGridCategoryBox
                  categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
                />
                <div className="text-center mx-auto mt-10 md:mt-16">
                  <ButtonSecondary>Show me more</ButtonSecondary>
                </div>
              </div> */}
      
              {/* === SECTION 5 === */}
              {/* <SectionSliderNewAuthors
                heading="Top elite authors"
                subHeading="Discover our elite writers"
                authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
                uniqueSliderClass="PageArchive"
              />
      
              <SectionSubscribe2 /> */}
            </div>

          )
        }
  
      </div>
    );

  }
};

export default PageArchive;
