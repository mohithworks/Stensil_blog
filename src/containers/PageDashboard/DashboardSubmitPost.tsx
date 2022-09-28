import React, {useEffect, useState} from "react";
import Input from "components/Input/Input";
import ButtonPrimary from "components/Button/ButtonPrimary";
import Select from "components/Select/Select";
import Textarea from "components/Textarea/Textarea";
import Label from "components/Label/Label";
import useDrivePicker from 'react-google-drive-picker';
import { useGDocsContext } from 'utils/gdocscontext';
import axios from "axios";
import Collapse from '@mui/material/Collapse';
import {Alert} from "components/Alert/Alert";
import supabaseClient from "utils/supabaseClient";
//import Resizer from "react-image-file-resizer";
import checkDetails from "utils/checkDetails";
import Compress from "browser-image-compression";

const DashboardSubmitPost = () => {
  const [loading, setLoading] = useState(true);
  const [loadingtxt, setloadingtxt] = useState<any>("Loading...");

  const [openPicker, authResponse] = useDrivePicker(); 
  const [showAlert, setshowAlert] = useState(false);
  const [errortxt, setErrortxt] = useState("");
  const [alertType, setalertType] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [oauthToken, setoauthToken] = useState<any>();
  const [docs, setDocs] = useState();
  const [docsName, setdocsName] = useState("Select your Google Docs from your Google Account");
  const { user } = useGDocsContext();

  const [postmetaCon, setpostmetaCon] = useState<boolean>(false);
  const [title, setTitle] = useState<any>("");
  const [category, setCategory] = useState<any>();
  const [categoryList, setcategoryList] = useState<any>();
  const [fi, setFi] = useState<any>();
  const [fihighRes, setfihighRes] = useState<any>();
  const [filowRes, setfilowRes] = useState<any>();
  const [fiName, setfiName] = useState<any>("No file");
  const [post, setPost] = useState<any>();

  const authUser = supabaseClient.auth.user();
  const authId = authUser?.id;

  var session:any;

  const alertMsg = (val: string, errtype: string) => {
    setErrortxt(val);
    setalertType(errtype);
    setshowAlert(true);
    setbtnLoading(false);
  }
  
  useEffect(() => {

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('category')
        .select('id, title, name')
        .eq('createdby', authId)

        if(error) {
          console.log(error);
        }
        
        if(data) {
          setcategoryList(data);
          console.log(data);
          setLoading(false);
        }
    }
    fetchPost();
    
  }, []);

  const getFile = (e: any) => {
    if (e.target.files.length > 0) {
      
      if (["image/jpeg", "image/png"].indexOf(e.target.files[0].type) > -1) {
        setbtnDisabled(true);
        alertMsg("Featured Image conversion is under progress. Please wait before you submit the post", "warning");
        const file = e.target.files[0];
        const filehdName = 'hd.jpeg';
        const filesdName = 'sd.jpeg';
        const filetype = 'image/jpeg';
        const highresOptions = {
          maxSizeMB: 0.05,
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

  const createPicker = (e: any) => {
    e.preventDefault();
    const session = supabaseClient.auth.session();
    const provider = session?.provider_token;
    console.log(session);
    if(provider) {
      openPicker({
        clientId: import.meta.env.VITE_GAUTHDOCS_CLIENTID,
        developerKey: "AIzaSyB-1hDSWdCbUqyRPIZ1x77brHFkO8xR8fc",
        viewId: "DOCUMENTS",
        token: provider, // pass oauth token in case you already have one
        showUploadView: false,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: false,
        // customViews: customViewsArray, // custom view
        callbackFunction: (data: any) => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button')
          }else if (data.action === 'picked') {
            setDocs(data.docs[0].id);
            setdocsName(data.docs[0].name + ' Selected');
            const fileId = data.docs[0].id;
            console.log(data.docs[0].id);
            console.log(provider);
            setoauthToken(provider);
            setTitle(data.docs[0].name);
            setpostmetaCon(true);
            // axios.post("http://localhost:55232/.netlify/functions/gdocs/", { 
            //   docs
            // }).then(res => {
            //     console.log(res);
            //   }).catch(err => {
            //     console.log(err);
            //   });
          
            // axios.post('/functions/gdocs', {
            //   docs, accessToken
            // }).then((res) => {
            //   //getting some error axios req rest all is dne
            //     console.log(res);
            // }).catch((err) => {
            //   console.log(err);
            // });
          }
          console.log(data);
          // setDocsName(data.docs[0].name + " Selected");
        },
      })
      
    }
  }

  var fihd:any, 
      fisd:any;

  const uploadFi = async (postTitle:any) => {
    const images = [fihighRes, filowRes];
    const imagesName = ['hd.jpeg','sd.jpeg'];
    alertMsg("Uploading featured image. This may take a while. Please make sure you have stable internet connection", "warning");
    setbtnLoading(true);

    for(var i = 0 ; i <= 1; i++) {
      
      const imagepath = 'public/'+authId+'/'+postTitle+'/featuredImg/'+ imagesName[i];

      const { data, error } = await supabaseClient.storage
      .from('posts')
      .upload(imagepath, images[i], {
        upsert: true,
      });
      if(error) throw alertMsg(error.message, "error");
      if(data) {
        const { publicURL, error } = await supabaseClient.storage
        .from('posts')
        .getPublicUrl(imagepath);
        if(error) throw alertMsg(error.message, "error");
        if(publicURL) {
          console.log(publicURL);
          if(i == 0) { fihd = publicURL } else { fisd = publicURL; }
        }
        //setbtnLoading(false);
      }
    }
    return true;
  }

  const createPost = async (e: any) => {
    e.preventDefault();
    if(title == "" || category == undefined || category == "-1" || fihighRes == undefined || filowRes == undefined) {
      alertMsg("All fields are required", "error");
    }else {
      setshowAlert(false);
      setErrortxt("");
      setbtnLoading(true);

      var postTitle = title.replace(/ /g, "-").toLowerCase();
      
      const options = {
        method: 'GET',
        url: 'https://stensil-backend.herokuapp.com/api',
        params: {fileId: docs, accessToken: oauthToken, title: postTitle, authid: authId },
      }

      checkDetails(postTitle, "posttitle", "posttitle", "posts").then(async (res) => { 
        if(res.posttitle == postTitle){
          alertMsg("Title already exists. Choose a different title", "error");
        }else if(res.code && res.code == "PGRST116") { 
          uploadFi(postTitle).then(() => { 
            setbtnLoading(false);
            console.log(fihd);
            console.log(docs);
            alertMsg("Featured Image uploaded. Conversion of Google Docs file id to blog post is under progress...", "success");
            setbtnLoading(true);
            axios.request(options).then(async (response) => {
                setPost(response.data);
                console.log(response.data);
                alertMsg("Conversion of Google Docs file id to blog post complete. Saving your post.......", "success");
                setbtnLoading(true);
                console.log(authUser);
                console.log(fihd);
                console.log(fisd);
                //setbtnLoading(false);
                const postUrl = '/posts/'+postTitle;
                const { data, error } = await supabaseClient.from('posts').insert(
                  [
                    { posttitle: postTitle, title: title, category: category, post: response.data, featured_imghd: fihd, featured_imgsd: fisd, postedby: authId, docsid: docs, href: postUrl },
                  ],
                  { upsert: true }
                );
                if(error) throw alertMsg(error.message, "error");
                if(data) {
                  console.log(data);
                  setfilowRes('');
                  setfihighRes('');
                  setfiName('');
                  alertMsg("Post created successfully", "success");
                  setpostmetaCon(false);
                }
    
            }).catch((error) => {
              alertMsg(error.message, "error");
            });
          })

        }
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

    return (
      <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
        <form className="grid md:grid-cols-2 gap-6" action="#" method="post">
        
          <div onClick={(e: any) => createPicker(e)} className="block md:col-span-2 cursor-pointer ">
            <Label>Select Google Doc</Label>
  
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
              <img className="mx-auto h-12 w-12 text-neutral-400" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjUiIGhlaWdodD0iMjUiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIHRyYW5zZm9ybT0iIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMCwxNzJ2LTE3MmgxNzJ2MTcyeiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxwYXRoIGQ9IiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxwYXRoIGQ9IiIgZmlsbD0ibm9uZSI+PC9wYXRoPjxnIGZpbGw9IiM3Nzc3NzciPjxwYXRoIGQ9Ik00OC4xNiwyNC4wOGMtNS43MDAwOCwwIC0xMC4zMiw0LjYxOTkyIC0xMC4zMiwxMC4zMnYxMDMuMmMwLDUuNzAwMDggNC42MTk5MiwxMC4zMiAxMC4zMiwxMC4zMmg3NS42OGM1LjcwMDA4LDAgMTAuMzIsLTQuNjE5OTIgMTAuMzIsLTEwLjMydi02MS41MDM0NGMwLC0xLjgyMzIgLTAuNzI1NjMsLTMuNTc0MzggLTIuMDE1NjMsLTQuODY0MzhsLTQ1LjEzNjU2LC00NS4xMzY1NmMtMS4yOSwtMS4yOSAtMy4wNDExOCwtMi4wMTU2MiAtNC44NjQzOCwtMi4wMTU2MnpNNDguMTYsMjcuNTJoMzQuNHYzNy44NGMwLDUuNzAwMDggNC42MTk5MiwxMC4zMiAxMC4zMiwxMC4zMmgzNy44NHY2MS45MmMwLDMuODAxMiAtMy4wNzg4LDYuODggLTYuODgsNi44OGgtNzUuNjhjLTMuODAxMiwwIC02Ljg4LC0zLjA3ODggLTYuODgsLTYuODh2LTEwMy4yYzAsLTMuODAxMiAzLjA3ODgsLTYuODggNi44OCwtNi44OHpNODYsMjkuOTUyMTlsNDIuMjg3ODEsNDIuMjg3ODFoLTM1LjQwNzgxYy0zLjgwMTIsMCAtNi44OCwtMy4wNzg4IC02Ljg4LC02Ljg4ek02MC4yLDk2LjMyYy0wLjk0OTQ0LDAgLTEuNzIsMC43NzA1NiAtMS43MiwxLjcyYzAsMC45NDk0NCAwLjc3MDU2LDEuNzIgMS43MiwxLjcyaDUxLjZjMC45NDk0NCwwIDEuNzIsLTAuNzcwNTYgMS43MiwtMS43MmMwLC0wLjk0OTQ0IC0wLjc3MDU2LC0xLjcyIC0xLjcyLC0xLjcyek02MC4yLDExNi45NmMtMC45NDk0NCwwIC0xLjcyLDAuNzcwNTYgLTEuNzIsMS43MmMwLDAuOTQ5NDQgMC43NzA1NiwxLjcyIDEuNzIsMS43Mmg1MS42YzAuOTQ5NDQsMCAxLjcyLC0wLjc3MDU2IDEuNzIsLTEuNzJjMCwtMC45NDk0NCAtMC43NzA1NiwtMS43MiAtMS43MiwtMS43MnoiPjwvcGF0aD48L2c+PC9nPjwvZz48L3N2Zz4="/>
                {/* <svg className="mx-auto h-12 w-12 text-neutral-400" viewBox="0 0 231.306 231.306">  
                  
                  <path d="M229.548,67.743L163.563,1.757C162.438,0.632,160.912,0,159.32,0H40.747C18.279,0,0,18.279,0,40.747v149.813   c0,22.468,18.279,40.747,40.747,40.747h149.813c22.468,0,40.747-18.279,40.747-40.747V71.985   C231.306,70.394,230.673,68.868,229.548,67.743z M164.32,19.485l47.5,47.5h-47.5V19.485z M190.559,219.306H40.747   C24.896,219.306,12,206.41,12,190.559V40.747C12,24.896,24.896,12,40.747,12H152.32v60.985c0,3.313,2.687,6,6,6h60.985v111.574   C219.306,206.41,206.41,219.306,190.559,219.306z"/>
                  <path d="m103.826,52.399c-5.867-5.867-13.667-9.098-21.964-9.098s-16.097,3.231-21.964,9.098c-5.867,5.867-9.098,13.667-9.098,21.964 0,8.297 3.231,16.097 9.098,21.964l61.536,61.536c7.957,7.956 20.9,7.954 28.855,0 7.955-7.956 7.955-20.899 0-28.855l-60.928-60.926c-2.343-2.343-6.143-2.343-8.485,0-2.343,2.343-2.343,6.142 0,8.485l60.927,60.927c3.276,3.276 3.276,8.608 0,11.884s-8.607,3.276-11.884,0l-61.536-61.535c-3.601-3.601-5.583-8.388-5.583-13.479 0-5.092 1.983-9.879 5.583-13.479 7.433-7.433 19.525-7.433 26.958,0l64.476,64.476c11.567,11.567 11.567,30.388 0,41.955-5.603,5.603-13.053,8.689-20.977,8.689s-15.374-3.086-20.977-8.689l-49.573-49.574c-2.343-2.343-6.143-2.343-8.485,0-2.343,2.343-2.343,6.142 0,8.485l49.573,49.573c7.87,7.87 18.333,12.204 29.462,12.204s21.593-4.334 29.462-12.204 12.204-18.333 12.204-29.463c0-11.129-4.334-21.593-12.204-29.462l-64.476-64.476z"/>
                </svg> */}
                {/* <div className="flex flex-col sm:flex-row text-sm text-neutral-6000">
                  <label
                    htmlFor="file-upload"
                    className="item-center cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div> */}
                <p className="text-xs text-neutral-500">
                  {docsName}
                </p>
              </div>
            </div>
          </div>
          
          {postmetaCon && (<>
            <label className="block md:col-span-2">
              <Label>Post Title *</Label>
  
              <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="mt-1" />
            </label>
            <label className="block md:col-span-2">
              <Label>Category</Label>
  
              <Select onChange={(e) => setCategory(e.target.value)} className="mt-1">
                <option value="-1">– select –</option>
                <option value="255d4855-644e-43ab-829b-16adc417df97">None</option>
                {
                  (categoryList.length > 0) && categoryList.map((item:any) => {
                    return (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    )
                  })
                }
              </Select>
            </label>
            <div className="block md:col-span-2">
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
                        onChange={getFile}
                        className="sr-only"
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
            <ButtonPrimary disabled={btnDisabled} loading={btnLoading} onClick={(e:any) => createPost(e)} className="md:col-span-2" type="submit">
              Submit post
            </ButtonPrimary>
          </>)}  
          {/* <label className="block">
            <Label>Tags</Label>
  
            <Input type="text" className="mt-1" />
          </label> */}
  
          <Collapse className="md:col-span-2" in={showAlert}>
            <Alert containerClassName="block" type={alertType} children={errortxt} onClick={(e: any) => {
              e.preventDefault();
              setshowAlert(false)
              }}/>
          </Collapse>
        </form>
      </div>
    );
  }

};

export default DashboardSubmitPost;
