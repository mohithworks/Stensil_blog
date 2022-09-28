import React, {useState, useEffect} from "react";
import NcImage from "components/NcImage/NcImage";
import PostPagination from "components/Pagination/PostPagination";
import { Link } from "react-router-dom";
import supabaseClient from "utils/supabaseClient";
import ButtonSecondary from "components/Button/ButtonSecondary";
import { useGDocsContext } from 'utils/gdocscontext';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';

const DashboardPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any>();
  const [currentPage, setcurrentPage] = useState<any>(1);
  const [authorDetails, setauthorDetails] = useState<any>();
  const [postsperPage, setpostsperPage] = useState<any>(5);
  const [snackMsg, setsnackMsg] = useState<any>("");
  const [snackDuration, setsnackDuration] = useState<any>();
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [syncDisabled, setsyncDisabled] = useState<any>(false);
  const [loadingtxt, setloadingtxt] = useState<any>("Loading...");

  const { user } = useGDocsContext();

  const authUser = supabaseClient.auth.user();
  const authSession = supabaseClient.auth.session();
  const authId = authUser?.id;
  const authProvider = authSession?.provider_token;
  const authorfullname = authUser?.user_metadata.full_name;
  const authorusername = authorfullname.replace(/ /g, "").toLowerCase();

  const fetchPost = async() => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from('posts')
      .select(`*, authors(*)`)
      .eq('postedby', authId)

      if(error) {
        console.log(error);
      }

      if(data?.length == 0) {
        setloadingtxt("No Posts");
      }else if(data) {
        setPosts(data);
        console.log(data);
        setauthorDetails(data[0].authors);
        console.log(data);
        setLoading(false);
      }
  }

  useEffect(() => {
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
          setsnackStatus(false);
        }

    }).catch((error) => {
      setsnackMsg(error.message);
      setsyncDisabled(false);
    });
  }

  const deletePosts = async (posttitle: any, post: any) => {
    const imgRegex = /[\w\.\$]+(?=png|jpeg|jpg|gif)\w*/gi;

    const mainfolderPath = 'public/'+authId+'/'+posttitle;
    const folderPath = mainfolderPath+'/featuredImg/'+'hd.jpeg';
    const folderPath2 = mainfolderPath+'/featuredImg/'+'sd.jpeg';

    var res = post.match(imgRegex);
    res = res.map((item: any) => {
      return mainfolderPath+'/'+item;
    });
    res.push(folderPath, folderPath2);
    console.log(res);

    setsnackMsg("Deleting.....");
    setsnackStatus(true);

    const { data, error } = await supabaseClient.storage
    .from('posts')
    .remove(res);

    if(error) throw setsnackMsg(error.message);
    if(data) {
      const { data, error } = await supabaseClient
      .from("posts")
      .delete()
      .eq('posttitle', posttitle)
      .eq('postedby', authId);
      if(error) throw setsnackMsg(error.message);
      if(data) {
        fetchPost().then(() => {
          setsnackMsg("Delete Complete");
          setsyncDisabled(false);
          setsnackStatus(false);
        });
      }
    }
    
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
                {loadingtxt}
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
                  {currentPosts.map((item:any, index:any) => {
                    var href = '/'+authorDetails.username+item.href;
                    console.log(href);
                    console.log(index);
                    return (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="flex items-center w-96 lg:w-auto max-w-md overflow-hidden">
                          <NcImage
                            containerClassName="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden lg:h-14 lg:w-14"
                            src={item.featured_imgsd}
                          />
                          <Link to={href} className="ml-4 flex-grow">
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
                        <span>{new Date(item.created_at).toDateString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                        <a
                          onClick={() => deletePosts(item.posttitle, item.post)}
                          className="text-rose-600 hover:text-rose-900 cursor-pointer"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <PostPagination totalPosts={authorDetails.posts} postsperPage={postsperPage} currentPage={currentPage} setcurrentPage={setcurrentPage} />
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
