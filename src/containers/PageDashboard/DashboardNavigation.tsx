import React, {useState, useEffect, useRef} from "react";
import NcImage from "components/NcImage/NcImage";
import PostPagination from "components/Pagination/PostPagination";
import { Link } from "react-router-dom";
import supabaseClient from "utils/supabaseClient";
import ButtonThird from "components/Button/ButtonThird";
import Snackbar from '@mui/material/Snackbar';
import ButtonPrimary from "components/Button/ButtonPrimary";
import Dialog from '@mui/material/Dialog';
import Input from "components/Input/Input";
import Label from "components/Label/Label";
import Collapse from '@mui/material/Collapse';
import {Alert} from "components/Alert/Alert";
import checkDetails from "utils/checkDetails";
import Select from "components/Select/Select";
import isURL from 'validator/es/lib/isURL'


const DashboardNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [loadingtxt, setloadingtxt] = useState<any>("Loading...");
  const [showAlert, setshowAlert] = useState(false);
  const [errortxt, setErrortxt] = useState("");
  const [alertType, setalertType] = useState("");
  const [dialogOpen, setdialogOpen] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [navigation, setNavigation] = useState<any>([]);
  const [posts, setPosts] = useState<any>();
  const [currentPage, setcurrentPage] = useState<any>(1);
  const [authorDetails, setauthorDetails] = useState<any>();
  const [postsperPage, setpostsperPage] = useState<any>(5);
  const [snackMsg, setsnackMsg] = useState<any>("");
  const [snackDuration, setsnackDuration] = useState<any>();
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [syncDisabled, setsyncDisabled] = useState<any>(false);

  const name = useRef<any>("");
  const [type, setType] = useState<any>();
  const link = useRef<any>("");

  const authUser = supabaseClient.auth.user();
  const authId = authUser?.id;

  const fetchPost = async() => {
    const { data, error } = await supabaseClient
      .from('navigation')
      .select(`*`)
      .eq('createdby', authId)

      if(error) {
        console.log(error);
      }

      if(data) {
        setNavigation(data);
        console.log(data);
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const alertMsg = (val: string, errtype: string) => {
    setErrortxt(val);
    setalertType(errtype);
    setshowAlert(true);
    setbtnLoading(false);
    setbtnDisabled(false);
  }

  const handleClose = (e:any) => {
    e.preventDefault();
    setdialogOpen(false);
  };

  const saveNavigation = async (e: any) => {
    e.preventDefault();
    //Regex with - as special character along with aplhanumeric
    const nameReg = /^([a-zA-Z0-9- ]){3,25}$/;
    let urlOptions = {
        protocols: [
            'http',
            'https',
        ],
        require_protocol: true,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false
    }

    const navName = name.current.value;
    const navLink:any = link.current.value;
    console.log(navName, navLink, type);
    const navType = type;
    if(navName == "" || type == "-1" || navLink == "") {
      alertMsg("All fields are required", "error");
    }else if(!isURL(navLink, urlOptions)) {
        alertMsg("URL entered is invalid", "error");
    }else if(!navName.match(nameReg)) {
        alertMsg("Name entered is invalid", "error");
    }else {
      setshowAlert(false);
      setErrortxt("");
      setbtnDisabled(true);
      setbtnLoading(true);
        //https://google.com
        const { data, error } = await supabaseClient
        .from("navigation")
        .select('name, type')
        .eq('type', type)
        .eq('createdby', authId);

        if(error) throw alertMsg(error.message, "error");
        
        const existingName = data?.filter(function(obj:any) {
          return ((obj.name == navName) && (obj.type == navType));
        });
        console.log(existingName);
        if(existingName?.length > 0) { 
          alertMsg("Navigation with same name already exists", "error");
        }else {

          if(type == "Navigation Menu" && data?.length == 5) {
              alertMsg("Limit reached!! Maximum no of Navigation menu that can be created is 5", "error");
          }else if(type == "Social Icon" && data?.length == 4) {
              alertMsg("Limit reached!! Maximum no of Social icons that can be created is 4", "error");
          }else if(type == "CTA Button" && data?.length == 1) {
              alertMsg("Limit reached!! Maximum no of CTA Buttons that can be created is 1", "error");
          }else {
              const { data, error } = await supabaseClient.from('navigation').insert(
                [
                  { name: navName, type: type, link: navLink, createdby: authId },
                ],
                { upsert: true }
              );
              if(error) throw alertMsg(error.message, "error");
              if(data) {
                console.log(data);
                setNavigation([...navigation, data[0]]);
                alertMsg("Navigation Menu created successfully", "success");
                setErrortxt("");
                setshowAlert(false);
                setdialogOpen(false);
              }
              
          }
          setbtnDisabled(false);
          setbtnLoading(false);
        
        }
      

    }

  }

  const deleteNavigation = async (id: any, name: any, navLength: number) => { 
    console.log(id);
    console.log(name);
    setsnackMsg("Deleting.....");
    setsnackStatus(true);
    
    const { data, error } = await supabaseClient
    .from('navigation')
    .delete()
    .eq('id', id)

    if(error) throw setsnackMsg(error.message);
    if(data) {
        console.log(data);
        fetchPost().then(() => {
          if(navLength == 1) {
            setcurrentPage(currentPage - 1);
          }  
          setsnackMsg("Delete Complete");
          setsyncDisabled(false);
          setsnackStatus(false);
        });
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
    const currentNavigation = navigation.slice(firstIndex, lastIndex);

    return (
      <div className="flex flex-col space-y-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full px-1 sm:px-6 lg:px-8">
            <Dialog open={dialogOpen} className="justify-center items-center">
                <div className="justify-center items-center rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 pl-10 pr-10 pt-8">
                    <form className="grid md:grid-cols-2 gap-8 justify-center items-center">

                        <Collapse className="md:col-span-12" in={showAlert}>
                          <Alert containerClassName="block" type={alertType} children={errortxt} onClick={(e: any) => {
                            e.preventDefault();
                            setshowAlert(false)
                            }}/>
                        </Collapse>
                        <label className="block md:col-span-12">
                          <Label>Type</Label>

                          <Select onChange={(e) => setType(e.target.value)} className="mt-1">
                            <option value="-1">– select –</option>
                            <option value="Navigation Menu">Navigation Menu</option>
                            <option value="Social Icon">Social Icon</option>
                            <option value="CTA Button">CTA Button</option>
                          </Select>
                        </label>
                        {
                          type != "Social Icon" ? (
                            
                          <label className="block md:col-span-12">
                            <Label>Navigation Name</Label>

                            <Input type="text" ref={name} placeholder="Name" className="mt-1" />
                          </label>
                          )
                          : (
                            <label className="block md:col-span-12">
                              <Label>Name</Label>

                              <select ref={name} className={`nc-Select mt-1 block w-full text-sm rounded-lg border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900`}>
                                <option value="">– select –</option>
                                <option value="lab la-facebook-square">Facebook</option>
                                <option value="lab la-twitter">Twitter</option>
                                <option value="lab la-youtube">Youtube</option>
                                <option value="lab la-instagram">Instagram</option>
                              </select>
                            </label>
                          )
                        }
                        <label className="block md:col-span-12">
                          <Label>Link</Label>

                          <Input type="text" ref={link} placeholder="href" className="mt-1" />
                        </label>
                        <ButtonPrimary loading={btnLoading} disabled={btnDisabled}  onClick={(e:any) => saveNavigation(e)} sizeClass="px-4 py-2 sm:px-5 mb-5">
                            Save
                        </ButtonPrimary>
                        <ButtonThird onClick={handleClose} sizeClass="px-4 py-2 sm:px-5 mb-5">
                            Close
                        </ButtonThird>
                    </form>
                </div> 
            </Dialog>
            <div className="shadow dark:border dark:border-neutral-800 overflow-hidden sm:rounded-lg">
              <ButtonPrimary onClick={(e) => {e.preventDefault(); setdialogOpen(true);}} sizeClass="px-4 py-2 sm:px-5 mb-5 mt-5 mr-3 float-right">
                + &nbsp; Create New Navigation
              </ButtonPrimary>
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                    <th scope="col" className="px-6 py-3">
                      Navigation
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
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
                  {
                    navigation.length == 0 ? (
                        <tr>
                          <td className="px-6 py-4">
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span>No Navigation Menu Created</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span></span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                          </td>
                        </tr>

                    ): currentNavigation.map((item:any, index:any) => {
                        var href = '../'+'../'+'../'+'../'+'../'+'../'+item.link;
                        return (
                        <tr key={index}>
                          <td className="px-6 py-4">
                            <div className="flex items-center w-96 lg:w-auto max-w-md overflow-hidden">
                              <a href={item.link} className="ml-4 flex-grow">
                                {
                                  item.type == "Social Icon" ? (
                                    <h2 className="nc-SocialsList flex space-x-2.5 text-3xl dark:text-neutral-300">
                                      <i className={item.name}></i>
                                    </h2>
                                  ) : (
                                    <h2 className="inline-flex line-clamp-2 text-sm font-semibold  dark:text-neutral-300">
                                      {item.name}
                                    </h2>
                                  )
                                }
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span> {item.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span>{new Date(item.created_at).toDateString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                            <a
                              onClick={deleteNavigation.bind(this, item.id, item.name, currentNavigation.length)}
                              className="text-rose-600 hover:text-rose-900 cursor-pointer"
                            >
                              Delete
                            </a>
                          </td>
                        </tr>
                      )})
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <PostPagination totalPosts={navigation.length} postsperPage={postsperPage} currentPage={currentPage} setcurrentPage={setcurrentPage} />
        <Snackbar
          open={snackStatus}
          autoHideDuration={snackDuration}
          message={snackMsg}
        />
      </div>
    );

  }
};

export default DashboardNavigation;
