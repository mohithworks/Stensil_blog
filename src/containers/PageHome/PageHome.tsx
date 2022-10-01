import React, {useState, useEffect, useRef} from "react";
import SectionLatestPosts from "./SectionLatestPosts";
import SectionVideos from "./SectionVideos";
import SectionLargeSlider from "./SectionLargeSlider";
import { Helmet } from "react-helmet";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import SubSectionGridAuthorBox from "components/SectionGridAuthorBox/SubSectionGridAuthorBox";
import { PostDataType, TaxonomyType } from "data/types";
import {
  DEMO_POSTS,
} from "data/posts";
import { DEMO_CATEGORIES, DEMO_TAGS } from "data/taxonomies";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SubSectionSliderNewCategories from "components/SectionSliderNewCategories/SubSectionSliderNewCategories";
import ArchiveFilterListBox from "components/ArchiveFilterListBox/ArchiveFilterListBox";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { useGlobalContext } from 'utils/context';
import Card20 from "components/Card20/Card20";
import ButtonPrimary from "components/Button/ButtonPrimary";
import supabaseClient from "utils/supabaseClient";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { XIcon } from "@heroicons/react/solid";
import Select from "components/Select/Select";
import Heading from "components/Heading/Heading";
//
const POSTS: PostDataType[] = DEMO_POSTS;
//
const MAGAZINE1_TABS = ["all", "Garden", "Fitness", "Design"];
const MAGAZINE1_POSTS = DEMO_POSTS.filter((_, i) => i >= 8 && i < 16);
const MAGAZINE2_POSTS = DEMO_POSTS.filter((_, i) => i >= 0 && i < 7);
//
var inPage:any = 0, fnPage:any = 10, postsLoc:any = [], icPage:any = 0, fcPage:any = 10, catVal: any = "-1";

const PageHome: React.FC = () => {
  const { author, post, navigation, initpostRange, finpostRange } = useGlobalContext();

  const location = window.location.hostname.split(".")[0];
  const url = import.meta.env.VITE_URL;  

  const [btnLoading, setbtnLoading] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>();
  const [catLoading, setcatLoading] = useState<any>(true);
  const [catError, setcatError] = useState<any>();
  const [snackMsg, setsnackMsg] = useState<any>("");
  const [snackDuration, setsnackDuration] = useState<any>();
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [categories, setCategories] = useState<any>();
  
  const [categoryList, setcategoryList] = useState<any>(catVal);
  const authorSlug = location != url ? location == 'stensil-blog' ? 'hrithik' : location : 'hrithik';

  const [currentPosts, setcurrentPosts] = useState<any>(postsLoc);
  console.log("currentPosts", currentPosts);

  if(currentPosts?.length == 0){
    postsLoc = post;
    setcurrentPosts(postsLoc);
  }

  // useEffect(() => {
  //     postsLoc = JSON.parse(localStorage.getItem('postsLoc')!);

  //     if(postsLoc != post) {
  //       if(postsLoc) {
  //         console.log("Reload called");
  //         localStorage.setItem('postsLoc', JSON.stringify(post));
  //         postsLoc = JSON.parse(localStorage.getItem('postsLoc')!);
  //         setcurrentPosts(postsLoc);
  //         setLoading(false);
  //       }
  //     }
  // }, []);

  useEffect(() => {
    const fetchCat = async() => {
      // var posts:any = await supabaseFetch('posts', 'title, created_at, featured_imghd, href, authors!inner(*), category!inner(*)', 'authors.username');
      const {data, error} = await supabaseClient
      .from('category')
      .select('*, authors!inner(*)')
      .eq('authors.username', authorSlug)
      .gt('posts', 0);

      if(error) {
        throw setcatError(error.message);
      }

      if(data) {
        console.log(data);
        setCategories(data);
        setcatLoading(false);
      }
    }
    location != url ? fetchCat() : null;
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setsnackStatus(false);
  };

  const FILTERS = [
    { name: "Most Recent" },
    { name: "Curated by Admin" },
    { name: "Most Appreciated" },
    { name: "Most Discussed" },
    { name: "Most Viewed" },
  ];

  const snackAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        
        <XIcon className={`w-5 h-5`} />
      </IconButton>
    </>
  );

  const posts = post?.sort((a:any, b:any) => {
    return b.created_at - a.created_at;
  }).slice(0, 3);

  // var initRange:any = parseInt(localStorage.getItem('initpostRange')!);
  // var finRange:any = parseInt(localStorage.getItem('finpostRange')!);

  console.log(currentPosts);
  console.log(inPage);
  console.log(fnPage);
  
  const fetchNxtPost = async () => {
    inPage = inPage + 10;
    fnPage = fnPage + 10;
    
    console.log(inPage);
    console.log(fnPage);

    const {data,error} = await supabaseClient
      .from('posts')
      .select('title, created_at, featured_imghd, href, authors!inner(*), category!inner(*)')
      .eq('authors.username', location)
      .range(inPage, fnPage);

      if(error) {
        setsnackMsg(error.message);
        throw setsnackStatus(true);
      }

      if(data.length > 0) {
        console.log(data);
        postsLoc = [...postsLoc, ...data];
        // localStorage.setItem('postsLoc', JSON.stringify(newPosts));
        // localStorage.setItem('initpostRange', iPage);
        // localStorage.setItem('finpostRange', fPage);

        // var npostsLoc:any = JSON.parse(localStorage.getItem('postsLoc')!);
        console.log(postsLoc);
        setcurrentPosts(postsLoc);
        setbtnLoading(false);

      }else {
        setbtnLoading(false);
        setsnackMsg("No Posts to show");
        setsnackStatus(true);

      }

  }

  const fetchNewCat = async (catId:any) => {
    icPage = icPage + 10;
    fcPage = fcPage + 10;
    
    const {data,error} = await supabaseClient
      .from('posts')
      .select('title, created_at, featured_imghd, href, authors!inner(*)')
      .eq('authors.username', location)
      .eq('category', catId)
      .range(icPage, fcPage);

      if(error) {
        throw setError(error.message);
      }

      if(data.length > 0) {
        console.log(data);
        postsLoc = [...postsLoc, ...data];
        setcurrentPosts(postsLoc);
        setLoading(false);

      }else {
        setLoading(false);
        setsnackMsg("No Posts to show");
        setsnackStatus(true);

      }
  }

  const fetchCatPost = async (catId:any) => {
    setLoading(true);
    catVal = catId;
    setcategoryList(catId);
    if(catId == "-1") {
      inPage = -10, fnPage = 0;
      postsLoc = [];
      fetchNxtPost().then(() => {
        setLoading(false);
      });
    }else {
      icPage = -10, fcPage = 0;
      postsLoc = [];
      fetchNewCat(catId).then(() => {
        setLoading(false);
      });

    }

  }

  const setPosts = (catId:any) => {
    console.log(categoryList);
    setbtnLoading(true);
    if(catId == "-1") {
      fetchNxtPost();
    }else {
      fetchNewCat(catId).then(() => {
        setbtnLoading(false);
      });
    }
  }

  const href = (post: any) => { return location != url ? post.href : author.username+post.href; }

  return (
    <div className="nc-PageHome relative">
      <Helmet>
        <title>Home || Blog Magazine React Template</title>
      </Helmet>

      {/* ======== ALL SECTIONS ======== */}
      <div className="relative overflow-hidden">
        {/* ======== BG GLASS ======== */}
        {
          currentPosts?.length > 0 && ( 
            <BgGlassmorphism />
          )
        }

        {/* ======= START CONTAINER ============= */}
        <div className="container relative">
          {/* === SECTION  === */}
          <SectionLargeSlider
            className="pt-10 pb-16 md:py-16 lg:pb-28 lg:pt-20"
            heading={author[0].title}
            desc={author[0].description}
            type={"subDomain"}
            posts={posts}
          />

          {/* === SECTION  === */}
          <div className="relative py-16">
            <BackgroundSection />
            <SubSectionGridAuthorBox
              authors={author}
            />
          </div>

          {/* === SECTION 5 === */}
          {
            (catError) ?
            (
                <>
                  <div
                    className={`nc-PageSingleTemp4Sidebar pt-5 lg:pt-5`}
                    data-nc-id="PageSingleTemp4Sidebar"
                  >
                    {/*  */}
                    
                      <div className="container">
                        {/* HEADER */}
                        <header className="text-center max-w-2xl mx-auto space-y-7">
                          <h2 className="text-7xl md:text-8xl"></h2>
                          <span className="text-1xl md:text-1xl font-semibold tracking-widest">
                            There was an error loading categories. Please check your internet connection & try again
                          </span>
                          <span className="block text-1xl text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                          </span>
                        </header>
                      </div>
                  </div>
                </>
            )
            :
            (catLoading == true) ?
            (
              <div
                className={`nc-PageSingleTemp4Sidebar pt-5 lg:pt-5`}
                data-nc-id="PageSingleTemp4Sidebar"
              >
                {/*  */}
                
                <div className="container">
                  {/* HEADER */}
                  <header className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-7xl md:text-8xl"></h2>
                    <h1 className="text-2xl md:text-2xl font-semibold tracking-widest">
                      LOADING....
                    </h1>
                    <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                    </span>
                  </header>
                </div>
              </div>
            )
            :
            (categories.length != 0) ?
            (
              
              <SubSectionSliderNewCategories
                className="py-16 lg:py-28"
                heading="Top trending categories"
                itemPerRow={5}
                categories={categories}
                categoryCardType="card4"
                uniqueSliderClass="pageHome-section3"
              />
            ) : null
          }

        </div>

        {/* === SECTION 11 === */}
        {/* <div className="dark bg-neutral-900 dark:bg-black dark:bg-opacity-20 text-neutral-100">
          <div className="relative container">
            <SectionGridPosts
              className="py-16 lg:py-28"
              headingIsCenter
              postCardName="card10V2"
              heading="Explore latest video articles"
              subHeading="Hover on the post card and preview video 🥡"
              posts={DEMO_POSTS_VIDEO.filter((_, i) => i > 5 && i < 12)}
              gridClass="md:grid-cols-2 lg:grid-cols-3"
            />
          </div>
        </div> */}

        <div className="container ">

          {/* === SECTION 8 === */}
          <div className="relative py-16">
            <BackgroundSection />
             <SectionSubscribe2 className="pt-16 pb-10 lg:pt-28" />
          </div>

          {/* === SECTION 11 === */}
          {/* <SectionMagazine4
            className="py-16 lg:py-28"
            heading="Life styles 🎨 "
            posts={MAGAZINE2_POSTS}
            tabs={MAGAZINE1_TABS}
          /> */}


          {/* === SECTION 14 === */}
          {/* <div className="relative py-16">
            <BackgroundSection />
            <SectionBecomeAnAuthor />
          </div> */}

          {/* === SECTION 15 === */}
          {/* <SectionVideos className="py-16 lg:py-28" /> */}

          {/* === SECTION 17 === */}
          {/* <SectionLatestPosts
            className="pb-16 lg:pb-28"
            posts={DEMO_POSTS.filter((_, i) => i > 8 && i < 16)}
            widgetPosts={DEMO_POSTS.filter((_, i) => i > 2 && i < 7)}
            categories={DEMO_CATEGORIES.filter((_, i) => i > 2 && i < 8)}
            tags={DEMO_CATEGORIES}
          /> */}
          {/* === SECTION 12 === */}
          {
            (currentPosts?.length > 0) && (
              
              <div className="relative py-16">
                <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
                  <Heading isCenter desc={"Discover the most outstanding articles of our blog."}>
                    Explore latest articles
                  </Heading>
                  <div>
                    <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row">
                      <div className="block my-4 border-b w-full border-neutral-100 sm:hidden"></div>
                      <div className="flex justify-end">
                        <select value={categoryList} onChange={(e) => fetchCatPost(e.target.value)} className={`nc-Select mt-1 block text-sm rounded-lg border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}>
                          <option value="-1">All</option>
                          {
                            catLoading == false && categories.map((cat: any, i: number) => {
                              return (
                                <option key={i} value={cat.id}>{cat.name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                    {
                      (error) ?
                      (
                          <>
                            <div
                              className={`nc-PageSingleTemp4Sidebar pt-5 lg:pt-5`}
                              data-nc-id="PageSingleTemp4Sidebar"
                            >
                              {/*  */}
                              
                                <div className="container">
                                  {/* HEADER */}
                                  <header className="text-center max-w-2xl mx-auto space-y-7">
                                    <h2 className="text-7xl md:text-8xl"></h2>
                                    <h1 className="text-2xl md:text-2xl font-semibold tracking-widest">
                                      ERROR
                                    </h1>
                                    <span className="block text-1xl text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                                      Please check your internet connection & refresh the page
                                    </span>
                                  </header>
                                </div>
                            </div>
                          </>
                      )
                      :
                      (loading == true) ?
                      (
                        <div
                          className={`nc-PageSingleTemp4Sidebar text-center pt-10 lg:pt-16`}
                          data-nc-id="PageSingleTemp4Sidebar"
                        >
                          {/*  */}
                          
                          <div className="container relative py-16 lg:py-20">
                            {/* HEADER */}
                            <header className="text-center max-w-2xl mx-auto space-y-4">
                              <h2 className="text-7xl md:text-8xl"></h2>
                              <h1 className="text-2xl md:text-2xl font-semibold tracking-widest">
                                LOADING....
                              </h1>
                              <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                              </span>
                            </header>
                          </div>
                        </div>
                      )
                      :
                      (
                        <>
                        {/* LOOP ITEMS */}
                        <div className="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
                          {
                            currentPosts.map((post:any, index:any) => (
                              <Card20 key={index} post={post} postHref={'../'+'../'+href(post)} />
                            ))
                          }
                        </div>
              
                        {/* PAGINATIONS */}
                        {
                          (postsLoc.length > 10) && (
                            
                            <div className="flex mt-20 justify-center items-center">
                              <ButtonPrimary loading={btnLoading} onClick={() => setPosts(categoryList)}>Show me more</ButtonPrimary>
                            </div>
                          ) 
                        }
                        </>

                      )
                    }
          
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
            </div>
            )
          }
        </div>
        {/* ======= END CONTAINER ============= */}
        <Snackbar
          open={snackStatus}
          autoHideDuration={snackDuration}
          onClose={handleClose}
          action={snackAction}
          message={snackMsg}
        />
      </div>
    </div>
  );
};

export default PageHome;
