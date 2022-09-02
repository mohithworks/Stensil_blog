import React, {useState, useEffect} from "react";
import NcImage from "components/NcImage/NcImage";
import PostPagination from "components/Pagination/PostPagination";
import { Link } from "react-router-dom";
import supabaseClient from "utils/supabaseClient";
import ButtonSecondary from "components/Button/ButtonSecondary";
import { useGDocsContext } from 'utils/gdocscontext';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';

const people = [
  {
    id: 1,
    title: "Tokyo Fashion Week Is Making Itself Great Again",
    image:
      "https://images.unsplash.com/photo-1617059063772-34532796cdb5?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: true,
    payment: "Not Applicable",
  },
  {
    id: 2,
    title: "Traveling Tends to Magnify All Human Emotions",
    image:
      "https://images.unsplash.com/photo-1622987437805-5c6f7c2609d7?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: true,
    payment: "Not Applicable",
  },
  {
    id: 3,
    title: "Interior Design: Hexagon is the New Circle in 2018",
    image:
      "https://images.unsplash.com/photo-1617201277988-f0efcc14e626?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: true,
    payment: "Not Applicable",
  },
  {
    id: 4,
    title: "Heritage Museums & Gardens to Open with New Landscape",
    image:
      "https://images.unsplash.com/photo-1622960748096-1983e5f17824?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: true,
    payment: "Not Applicable",
  },
  {
    id: 5,
    title:
      "Man agrees to complete $5,000 Hereford Inlet Lighthouse painting job",
    image:
      "https://images.unsplash.com/photo-1617202227468-7597afc7046d?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: false,
    payment: "Not Applicable",
  },
  {
    id: 6,
    title:
      "Denton Corker Marshall the mysterious black box is biennale pavilion",
    image:
      "https://images.unsplash.com/photo-1622978147823-33d5e241e976?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    liveStatus: true,
    payment: "Not Applicable",
  },
];

const DashboardPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any>();
  const [currentPage, setcurrentPage] = useState<any>(1);
  const [totalPosts, settotalPosts] = useState<any>();
  const [postsperPage, setpostsperPage] = useState<any>(5);
  const [snackMsg, setsnackMsg] = useState<any>("");
  const [snackDuration, setsnackDuration] = useState<any>();
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [syncDisabled, setsyncDisabled] = useState<any>(false);

  const { user } = useGDocsContext();

  const authUser = supabaseClient.auth.user();
  const authSession = supabaseClient.auth.session();
  const authProvider = authSession?.provider_token;
  const authorfullname = authUser?.user_metadata.full_name;
  const authorusername = authorfullname.replace(/ /g, "").toLowerCase();

  useEffect(() => {

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('posts')
        .select(`*, authors(*)`)
        .eq('postedby', authorusername)

        if(error) {
          console.log(error);
        }

        if(data) {
          setPosts(data);
          settotalPosts(data[0].authors.posts);
          console.log(data);
          setLoading(false);
        }
    }
    fetchPost();
  }, []);

  const syncPost = (e:any, docsid: any, postTitle: any) => {
    e.preventDefault();
    console.log(postTitle);
    setsyncDisabled(true);
    setsnackMsg("Syncing.....");
    setsnackStatus(true);
    const oauthToken = user.accessToken;
      
    const options = {
      method: 'GET',
      url: 'https://stensil-backend.herokuapp.com/api',
      params: {fileId: docsid, accessToken: authProvider, title: postTitle },
    }
    
    axios.request(options).then(async (response) => {
        console.log(response.data);
        const { data, error } = await supabaseClient
          .from('posts')
          .update({ post: response.data })
          .eq('posttitle', postTitle )
        if(error) throw setsnackMsg(error.message);
        if(data) {
          console.log(data);
          setsnackMsg("Sync Complete");
          setsnackDuration(6000);
          setsyncDisabled(false);
        }

    }).catch((error) => {
      setsnackMsg(error.message);
      setsyncDisabled(false);
    });
  }

  if(loading) {

    return (
      <>
        <div
          className={`nc-PageSingleTemp4Sidebar relative text-center pt-10 lg:pt-16`}
          data-nc-id="PageSingleTemp4Sidebar"
        >
          {/*  */}
          
          <div className="container relative py-16 lg:py-20">
            {/* HEADER */}
            <header className="text-center max-w-2xl mx-auto space-y-7">
              <h2 className="text-7xl md:text-8xl"></h2>
              <h2 className="text-4xl md:text-4xl font-semibold tracking-widest">
                LOADING....
              </h2>
              <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
              </span>
            </header>
          </div>
        </div>
      </>
    );

  }else {
    const lastIndex = currentPage * postsperPage;
    const firstIndex = lastIndex - postsperPage;
    const currentPosts = posts.slice(firstIndex, lastIndex);

    return (
      <div className="flex flex-col space-y-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full px-1 sm:px-6 lg:px-8">
            <div className="shadow dark:border dark:border-neutral-800 overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                    <th scope="col" className="px-6 py-3">
                      Posts
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sync
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
  
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentPosts.map((item:any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center w-96 lg:w-auto max-w-md overflow-hidden">
                          <NcImage
                            containerClassName="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden lg:h-14 lg:w-14"
                            src={item.featured_imgsd}
                          />
                          <Link to={item.href} className="ml-4 flex-grow">
                            <h2 className="inline-flex line-clamp-2 text-sm font-semibold  dark:text-neutral-300">
                              {item.title}
                            </h2>
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* {item.liveStatus ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-teal-100 text-teal-900 lg:text-sm">
                            Active
                          </span>
                        ) : ( */}

                          <ButtonSecondary disabled={syncDisabled} onClick={(e:any) => syncPost(e, item.docsid, item.posttitle)} className="px-2 inline-flex text-xs leading-5 font-medium rounded-full lg:text-sm" type="submit">
                            Sync
                          </ButtonSecondary>
                          {/* <span className="px-2 inline-flex text-sm text-neutral-500 dark:text-neutral-400 rounded-full">
                            Offline
                          </span> */}
                        {/* )} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        <span> {item.created_at}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                        <a
                          href="/#"
                          className="text-rose-600 hover:text-rose-900"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <PostPagination totalPosts={totalPosts} postsperPage={postsperPage} currentPage={currentPage} setcurrentPage={setcurrentPage} />
        <Snackbar
          open={snackStatus}
          autoHideDuration={snackDuration}
          message={snackMsg}
        />
      </div>
    );

  }
};

export default DashboardPosts;
