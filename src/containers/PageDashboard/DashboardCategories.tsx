import React, {useState, useEffect, useRef} from "react";
import NcImage from "components/NcImage/NcImage";
import PostPagination from "components/Pagination/PostPagination";
import { Link } from "react-router-dom";
import supabaseClient from "utils/supabaseClient";
import ButtonThird from "components/Button/ButtonThird";
import { useGDocsContext } from 'utils/gdocscontext';
import Snackbar from '@mui/material/Snackbar';
import ButtonPrimary from "components/Button/ButtonPrimary";
import Input from "components/Input/Input";
import Label from "components/Label/Label";
import Collapse from '@mui/material/Collapse';
import {Alert} from "components/Alert/Alert";
import Compress from "browser-image-compression";
import checkDetails from "utils/checkDetails";
import Dialog from '@mui/material/Dialog';

const DashboardCategories = () => {
  const [loading, setLoading] = useState(true);
  const [loadingtxt, setloadingtxt] = useState<any>("Loading...");

  const [showAlert, setshowAlert] = useState(false);
  const [errortxt, setErrortxt] = useState("");
  const [alertType, setalertType] = useState("");

  const [showcdAlert, setshowcdAlert] = useState(false);
  const [errorcdtxt, setErrorcdtxt] = useState("");
  const [alertcdType, setalertcdType] = useState("");
  
  const [dialogOpen, setdialogOpen] = useState(false);
  const [confirmdialogOpen, setconfirmdialogOpen] = useState(false);

  const [btnLoading, setbtnLoading] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [category, setCategory] = useState<any>([]);
  const [categoryId, setCategoryId] = useState<any>([]);
  const [posts, setPosts] = useState<any>();
  const [currentPage, setcurrentPage] = useState<any>(1);
  const [authorDetails, setauthorDetails] = useState<any>();
  const [postsperPage, setpostsperPage] = useState<any>(5);
  const [snackMsg, setsnackMsg] = useState<any>("");
  const [snackDuration, setsnackDuration] = useState<any>();
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [syncDisabled, setsyncDisabled] = useState<any>(false);
  const [fiName, setfiName] = useState<any>("No file");

  const name = useRef<any>("");
  const [fi, setFi] = useState<any>();
  const [fihighRes, setfihighRes] = useState<any>();
  const [filowRes, setfilowRes] = useState<any>();

  const authUser = supabaseClient.auth.user();
  const authId = authUser?.id;
  

  const fetchPost = async() => {
    const { data, error } = await supabaseClient
      .from('category')
      .select(`*, authors(*)`)
      .eq('createdby', authId)

      if(error) {
        console.log(error);
      }

      if(data?.length == 0) {
        setCategory(data);
        setLoading(false);
      }else if(data) {
        setCategory(data);
        console.log(data);
        setauthorDetails(data[0].authors);
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

  const getFile = (e: any) => {
    if (e.target.files.length > 0) {
      
      if (["image/jpeg", "image/png"].indexOf(e.target.files[0].type) > -1) {
        setbtnDisabled(true);
        alertMsg("Featured Image conversion is under progress. Please wait before you save the category", "warning");
        const file = e.target.files[0];
        const filehdName = 'hd.jpeg';
        const filesdName = 'sd.jpeg';
        const filetype = 'image/jpeg';
        const highresOptions = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          fileType: filetype,
        }
        const lowresOptions = {
          maxSizeMB: 1,
          maxWidthOrHeight: 320,
          fileType: filetype,
        }
        Compress(file, highresOptions)
        .then(compressedBlob => {
            const convertedBlobFile = new File([compressedBlob], filehdName, { type: filetype, lastModified: Date.now()})
            setfihighRes(convertedBlobFile);
            console.log(convertedBlobFile);
            Compress(file, lowresOptions)
            .then(compressedBlob => {
                const convertedBlobFile = new File([compressedBlob], filesdName, { type: filetype, lastModified: Date.now()})
                setfilowRes(convertedBlobFile);
                console.log(convertedBlobFile);
                setbtnDisabled(false);
                alertMsg("Featured Image conversion complete. You can now proceed to submit the post", "success");
            })
            .catch(e => {
              console.log(e);
            })

        })
        .catch(e => {
          console.log(e);
        })
        setFi(e.target.files[0]);
        setfiName(e.target.files[0].name);
      }else {
        alertMsg("The selected file type is not allowed", "error");
      }
    }
  }

  const handleClose = (e:any) => {
    e.preventDefault();
    setdialogOpen(false);
  };

  var fihd:any, 
      fisd:any;

  const uploadFi = async (categoryId:any) => {
    const images = [fihighRes, filowRes];
    const imagesName = ['hd.jpeg','sd.jpeg'];
    alertMsg("Uploading featured image. This may take a while. Please make sure you have stable internet connection", "warning");
    setbtnDisabled(true);
    setbtnLoading(true);

    for(var i = 0 ; i <= 1; i++) {
      
      const imagepath = 'public/'+authId+'/'+categoryId+'/featuredImg/'+ imagesName[i];

      const { data, error } = await supabaseClient.storage
      .from('category')
      .upload(imagepath, images[i], {
        upsert: true,
      });
      if(error) throw alertMsg(error.message, "error");
      if(data) {
        const { publicURL, error } = await supabaseClient.storage
        .from('category')
        .getPublicUrl(imagepath);
        if(error) throw alertMsg(error.message, "error");
        if(publicURL) {
          console.log(publicURL);
          const mainurl = publicURL + '?' + new Date().getTime();
          if(i == 0) { fihd = mainurl } else { fisd = mainurl; }
        }
        //setbtnLoading(false);
      }
    }
    return true;
  }

  const saveCategory = async (e: any) => {
    e.preventDefault();
    const nameReg = /^([a-zA-Z0-9 ]){3,20}$/;
    const cName = name.current.value;
    if(cName == "" || fihighRes == undefined || filowRes == undefined) {
      alertMsg("All fields are required", "error");
    }else if(!cName.match(nameReg)) {
      alertMsg("Name entered is invalid", "error");
    }else {
      setshowAlert(false);
      setErrortxt("");
      setbtnDisabled(true);
      setbtnLoading(true);

      var categoryTitle = cName.replace(/ /g, "-").toLowerCase();

      
      const { data, error } = await supabaseClient
      .from("category")
      .select('title')
      .eq('title', categoryTitle)
      .eq('createdby', authId);

      if(error) throw alertMsg(error.message, "error");
      else if(data?.length > 0) {
        alertMsg("Category already exists", "error");
      }else { 
        const { data, error } = await supabaseClient
        .from("category")
        .insert([
          {
            title: categoryTitle,
            name: cName,
            createdby: authId,
          }
        ]);

        if(error) {
          alertMsg(error.message, "error");
        }else if(data) {
          const categoryId = data[0].id;
          uploadFi(categoryId).then(async () => { 
            console.log(fihd);
            console.log(fisd);
            alertMsg("Featured Image uploaded. Saving the category details.....", "success");
            setbtnLoading(true);
            setbtnDisabled(true);
            const categoryUrl = '/category/'+categoryTitle;
            const { data, error } = await supabaseClient.from('category').update(
              { featured_imghd: fihd, featured_imgsd: fisd, href: categoryUrl }
            )
            .eq('id', categoryId)
            .eq('createdby', authId);
            if(error) throw alertMsg(error.message, "error");
            if(data) {
              fetchPost().then(() => {
                setbtnLoading(false);
                setbtnDisabled(false);
                setshowAlert(false);
                setdialogOpen(false);
              })
            }

          })
        }

      }
      

    }

  }

  const deleteAction = async (id:any) => {
    setsnackMsg("Deleting.....");
    setsnackStatus(true);
    //fd333462-3a7d-4d8e-ab14-38aeff2a0f14
    //"public/ab6b81e6-a4a8-43c1-a534-81f0878b2978/fd333462-3a7d-4d8e-ab14-38aeff2a0f14/featuredImg/hd.jpeg"
    const folderPath = 'public/'+authId+'/'+id+'/featuredImg/'+'hd.jpeg';
    const folderPath2 = 'public/'+authId+'/'+id+'/featuredImg/'+'sd.jpeg';

    const { data, error } = await supabaseClient.storage
    .from('category')
    .remove([folderPath, folderPath2]);

    if(error) throw setsnackMsg(error.message);
    if(data) {
      const { data, error } = await supabaseClient
      .from("category")
      .delete()
      .eq('id', id)
      .eq('createdby', authId);
      if(error) throw setsnackMsg(error.message);
      if(data) {
        setsnackMsg("Category deleted successfully");
        fetchPost().then(() => {
          setsnackMsg("Delete Complete");
          setsyncDisabled(false);
          setsnackStatus(false);
        });
      }
    }
    
    
  }  

  const confirmDelete = async () => { 
    setconfirmdialogOpen(false);
    setsnackMsg("Updating all the posts linked with the category.....");
    setsnackStatus(true);
    const { data, error } = await supabaseClient
    .from('posts')
    .update({ category: '255d4855-644e-43ab-829b-16adc417df97' })
    .eq('category', categoryId);
    if(error) throw setsnackMsg(error.message);
    if(data) {
      deleteAction(categoryId);
    }

  }

  const deleteCategory = async (id: any, name: any, posts: any) => { 
    if(posts > 0) {
      setCategoryId(id);
      setconfirmdialogOpen(true);
    } else {
      setconfirmdialogOpen(false);
      deleteAction(id);
    }
    // setsnackMsg("Deleting.....");
    // setsnackStatus(true);
    
    // const { data, error } = await supabaseClient
    // .from('category')
    // .delete()
    // .eq('id', id)

    // if(error) throw setsnackMsg(error.message);
    // if(data) {
    //     console.log(data);
    //     category.splice(category.indexOf(data[0]),1);
    //     setsnackMsg("Delete Complete");
    //     setsyncDisabled(false);
    //     setsnackStatus(false);
    // }
    
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
    const currentCategories = category.slice(firstIndex, lastIndex);

    return (
      <div className="flex flex-col space-y-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full px-1 sm:px-6 lg:px-8">
            
            <Dialog open={confirmdialogOpen} className="justify-center items-center" aria-labelledby="responsive-dialog-title">
                <div className="justify-center items-center rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 pl-10 pr-10 pt-8">

                        <Collapse className="md:col-span-12" in={showcdAlert}>
                          <Alert containerClassName="block" type={alertcdType} children={errorcdtxt} onClick={(e: any) => {
                            e.preventDefault();
                            setshowAlert(false)
                            }}/>
                        </Collapse>
                        <label className="block md:col-span-12">
                          <b>Note:- All posts linked with this category will not carry any category after delete</b>
                        </label>
                        <div className="block md:col-span-12 mt-10">
                          <label>Do you want to confirm your delete action?</label>
                        </div>
                        <div className="float-right mt-5">
                          <ButtonThird onClick={(e:any) => {
                            e.preventDefault();
                            setconfirmdialogOpen(false);
                          }} sizeClass="px-4 py-2 sm:px-5 mb-5" className="mr-5">
                              No
                          </ButtonThird>
                          <ButtonPrimary loading={btnLoading} disabled={btnDisabled} onClick={confirmDelete} sizeClass="px-4 py-2 sm:px-5 mb-5">
                              Yes
                          </ButtonPrimary>
                        </div>
                </div> 
            </Dialog>
            <Dialog open={dialogOpen} className="justify-center items-center" aria-labelledby="responsive-dialog-title">
                <div className="justify-center items-center rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 pl-10 pr-10 pt-8">
                    <form className="grid md:grid-cols-2 gap-8 justify-center items-center">

                        <Collapse className="md:col-span-12" in={showAlert}>
                          <Alert containerClassName="block" type={alertType} children={errortxt} onClick={(e: any) => {
                            e.preventDefault();
                            setshowAlert(false)
                            }}/>
                        </Collapse>
                        <label className="block md:col-span-12">
                          <Label>Category Name</Label>

                          <Input type="text" ref={name} placeholder="Name" className="mt-1" />
                        </label>
                        <div className="block md:col-span-12">
                          <Label>Featured Image</Label>

                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-neutral-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                              <div className="flex flex-col sm:flex-row text-sm text-neutral-6000">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="sr-only"
                                    onChange={getFile}
                                  />
                                </label>
                                <p className="pl-1">{fiName} Selected</p>
                              </div>
                              <p className="text-xs text-neutral-500">
                                PNG, JPG, GIF up to 2MB
                              </p>
                            </div>
                          </div>
                        </div>
                        <ButtonPrimary loading={btnLoading} disabled={btnDisabled}  onClick={(e:any) => saveCategory(e)} sizeClass="px-4 py-2 sm:px-5 mb-5">
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
                + &nbsp; Create New Category
              </ButtonPrimary>
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr className="text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                    <th scope="col" className="px-6 py-3">
                      Categories
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
                    category.length == 0 ? (
                        <tr>
                          <td className="px-6 py-4">
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span>No Categories Created</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                            <span></span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                          </td>
                        </tr>

                    ): currentCategories.map((item:any, index:any) => {
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
                                {item.name}
                              </h2>
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          <span>{new Date(item.created_at).toDateString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-300">
                          <a
                            onClick={() => deleteCategory(item.id, item.name, item.posts)}
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
  
        <PostPagination totalPosts={category.length} postsperPage={postsperPage} currentPage={currentPage} setcurrentPage={setcurrentPage} />
        <Snackbar
          open={snackStatus}
          autoHideDuration={snackDuration}
          message={snackMsg}
        />
      </div>
    );

  }
};

export default DashboardCategories;
