import ButtonPrimary from "components/Button/ButtonPrimary";
import Input from "components/Input/Input";
import Label from "components/Label/Label";
import React, {useState, useEffect} from "react";
import Textarea from "components/Textarea/Textarea";
import Collapse from '@mui/material/Collapse';
import {Alert} from "components/Alert/Alert";
import Compress from "browser-image-compression";
import supabaseClient from "utils/supabaseClient";

var logo:any,
favicon:any;

const DashboardEditProfile = () => {
  const imageIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAC+QAAAvkBiZ3BxgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAeYSURBVGiB7Zp7jFxVHcc/vzNTtzy2FhVbSwjKQ1uDiVGU0BYJWyIERAyPprYprxpNANukBom7M+eee+5uy1qzKsQ/FimQrTQwodHyaJXaFpXlkVAE0WTgDyLRqtsK8mjpbjtzfv4xd3FZdrc7j6Vd3E8y2TP3/s7v/L7zO/e87sIUU0xxNCNxHPeKyPwjHcgE02v+D0QCLMgOlqy1ciQjmSi89wpgjnQg7xdTQj9oTAn9oJE9vMm7KRQKmWKxeA1wPfD59PJzqrp+3rx5PYsXLy43NMIGUVVGu7q6jikWi48A64EFwHHpZ4GI3FUsFh/u6uo6ZgLirJuqhO7fv/9nwIXAa8CKTCYzJ4Rwkqp+K7120b59+26bgDjrZtxdN0mSz6jqNcDBEMIi59xzQ26v994/CzwNXO+cW+ece6nRwdZDNRm9GDAismmYSACstX8ENgHGGHNxowJsFOMWqqpz0uJfRrMRkT+nxZPqCWoiGHfXFZF/qyqqeupoNqp6elrcW29gzrmPiMhvjDFGRL6ey+V21+Nv3Bktl8vb0uJVzrlPjhDYqcCV6ddtw+9Xg3PuWBF5SETOUtUvhBB6nXOfrsfnuIU6554FHgaajTHb4jg+v1AoZAqFQiZJkhZjzKPA8cDm9Hmtie7u7mnGmEK6fXwFeBI4xRjzuPf+i7X6rWp6yWaz14rIn4DTRWRHsVh8vVgsvq6q24HTgOez2eyKWoNRVenr67sTuATYKyIXhhAuALYCJwI7kyRpqcV3VUJbW1tfnT59+nygHfgHlQweD+xW1SSEML+1tfXVWgIB8N6vA64G9gGX5PP5F51zb8+aNesyEbkXaFbVLXEcX1GtbxncmNay8e7o6JgF0NbW1ldt3eF4778PdAIHVfVrURS96zl3zhkR6RKRVUAZuMFae8c4/CrUKXQsnHNzjDEbgWwI4XLn3J7RbOM4vk5E1gOqqkujKLp/NNskSdpUtR1ARHL5fL5jrDgm9ITBOfdZY8wTwHnAAmPM7zo6Oj4xkm0cx5eKyB2AiMjqsUQCpMKuA0qq2u69v905d1gdDRfqvT/PGPM4cIqqPkFlgTE3hPCoc+7jw2zPFZH7qcznPp/P/3Q8bVhr71HVJcAAcFMmk+np7u6eNladhgpNB4lfAycAv2pubr4gm82eD7ygqmcOzaxz7kxgM3CMqnZba6Nq2oqiaJOIXAS8qarL+vr6tnZ2djaPZt8woUmSrBKRAjAduC2EcMXq1asPtLa27s1ms4uAF4C55XJ5R3t7+5eNMVtIf5B58+bdWEub+Xz+MaAF2AMs6u/v/61z7mMj2dYttFAoZLz3t6vqT9JL37PWrnLOhUGb1tbWvel8ONiNnwJOBnbMnDlzST2bdWvtrhDCucArIjL4A76HuoQ6544tFosPADcB/aq6xFrbNYrtnhBCS7rwF6AkIt9euXLlQD0xpL5fMsYsAHYB/SPZ1Dy9pIvuzSKyEPiPMeYbuVzu94ert2bNmhNLpdJ24HNAMZPJtLS1tf2zmraroa7pJUmS04wxT6Ui/xpCmD8ekfC/bpxmdm6pVHqwlhiqpWqh3vuzVfVJ4AxgVwjhHOdcsRofzrk95XJ5kao+IyIHqo2hFqo6BYzj+DJgI3AssC2EcKVz7s1aGk5XSl+qpW4tjDuj3vsbRGQTFZF3hhAurlXkeFm7du0JjfJ12IyqqnjvIyCqfNU4iiLXqADG4tChQ9/03t8oIj3GmHvq2TyMKdQ596H29va7RGQZlbXlDVEU/bzWxqolhHCfMaZLVW8tl8sd3vudwIYQwgPOubfH6aZX02yNOL10dnY2DwwMPAB8FdinqoujKNraWCmHx3u/Cbh82OU3RORBoCeXy20XET2cn1Gf0f7+/h1URO4GFh4JkQCq2pMW/wasorIo+LCqLlfVbUmSvJgkSX6kc6yhjDUY9QNPG2POsdY+35Coa2D27NlbqJwqngz8wVp7FnAm8EMqSThDVb0x5mXv/WPe++udczOG+5mwjXcjieP4NhH5rqr+OIqi1YPXnXMmm83ODyEsB5ZSOdYB6BeRh0IIG1R1q3OuNCleG2YymR4AEVnqnHtnAHXOhVwu97i19jtNTU1zgMFuPl1VrxKRu0VkOUyS96O5XO6ZdMk4S0QuHH6/vb194cDAwC+pHKwBvKaqcQjh9CiK7oYa3o8eQX4B3GqMuQZ4BMA5NyPtol9JbV4Fupqamm6/5ZZb3hpaeVJkFKBcLt8LBFW9dHDFZIy5SUQGRT7d1NT0KWvtmuEiYRIJdc79HdgOTC+VSovTY5PBgUmBswcGBkY9qZg0QgFUdUP6d/nBgwdXAh8FeqmMuCVgrfc+N1Ldd6aXo5Bea+3CoRfWrVt33IEDB/5F5d8J3gJmqGpLFEU7vfdXA3dTSd4PrLW3Dq1rqPwiRx2q+p4E3HzzzfvTHZQAM4DeKIp2Alhre4BljJLZo3aRMBpJkrSkL7UYzObQ+977JcAGKjNK3lpbOdV/3yOtE1WVJEleBnYP79qDjCR2Ug1GAOlOZaOq5kezsdbeB6wAApDEcbxs0gkFmDZt2o+Gd9nhWGt7VPVa4A0qz+0UU0xxFPNffXdIO+uPsxoAAAAASUVORK5CYII=';

  //var fileArray:any = [];

  const authUser = supabaseClient.auth.user();
  const authId = authUser?.id;

  const [loading, setLoading] = useState(true);
  const [loadingtxt, setloadingtxt] = useState<any>("Loading...");
  const [showAlert, setshowAlert] = useState(false);
  const [errortxt, setErrortxt] = useState("");
  const [alertType, setalertType] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const [btnDisabled, setbtnDisabled] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [logoImg, setlogoImg] = useState<any>();
  const [faviconImg, setfaviconImg] = useState<any>();
  const [nameError, setnameError] = useState(false);

  const [logoImgUrl, setlogoImgUrl] = useState<any>(imageIcon);
  const [faviconImgUrl, setfaviconImgUrl] = useState<any>(imageIcon);
  const [filechangeStatus, setfilechangeStatus] = useState<any>([]);

  useEffect(() => {

    const fetchPost = async() => {
      const { data, error } = await supabaseClient
        .from('authors')
        .select('username, title, description, logoimg, faviconimg')
        .eq('id', authId)

        if(error) {
          setErrortxt(error.message);
        }
        
        if(data) {
          console.log(data);
          setTitle(data[0].title);
          setDescription(data[0].description);
          setName(data[0].username);
          logo = data[0].logoimg;
          favicon = data[0].faviconimg;
          // setlogoImg(logo);
          // setfaviconImg(favicon);
          (!logo) ? setlogoImgUrl(imageIcon) : setlogoImgUrl(logo);
          (!favicon) ? setfaviconImgUrl(imageIcon) : setfaviconImgUrl(favicon);
          setLoading(false);
        }
    }
    fetchPost();
  }, []);

  const alertMsg = (val: string, errtype: string) => {
    setErrortxt(val);
    setalertType(errtype);
    setshowAlert(true);
    setbtnLoading(false);
    setbtnDisabled(false);
  }

  const handleName = (e:any) => {
    const unameReg = /^([a-z0-9]){6,30}$/;
    if(unameReg.test(e.target.value)) { 
      setnameError(false);
      setName(e.target.value);
      alertMsg("Blog name accepted", "success");
    } else {
      setnameError(true);
      alertMsg("Blog name can only containers lowercase alphabets & digits", "error");
    }
  }

  const loadImage = async (imageUrl:any, e:any, type: any) => {
    setbtnDisabled(true);

    const filetype = 'image/jpeg';

    const options = {
      maxSizeMB: 1,
      fileType: filetype,
    }

    const file = e.target.files[0];
    if (["image/jpeg", "image/png"].indexOf(file.type) > -1) {
      setbtnDisabled(true);
      alertMsg("Processing Image......", "warning"); 
      if(file.size <= 150000) {
        if(type == 'favicon') {
          const img = new Image();
          img.src = imageUrl;
          const supportedWidths = [48, 32, 16];
      
          img.onload = async () => {
            const width = img.width; const height = img.height;
            console.log(img);
            if(width != height) {
              alertMsg("Image must be square", "error");
            }else if(!supportedWidths.includes(width)) {
              alertMsg("Image must be 48x48, 32x32 or 16x16", "error");
            }else{
              const fileName = 'favicon.jpeg';
              Compress(file, options)
              .then(compressedBlob => {
                  const convertedBlobFile = new File([compressedBlob], fileName, { type: filetype, lastModified: Date.now()})
                  console.log(convertedBlobFile);
                  setfaviconImg(convertedBlobFile);
                  //fileArray.push(convertedBlobFile);
                  setfaviconImgUrl(URL.createObjectURL(convertedBlobFile));
                  //setfilechangeStatus(fileArray);
                  alertMsg("Favicon accepted", "success");
              })
              .catch(e => {
                throw alertMsg(e.message, "error");
              })
             
            }
          };
          img.onerror = (err) => {
            console.log("img error");
            console.error(err);
          };
        }else {
          console.log(type);
          const fileName = 'logo.jpeg';
          Compress(file, options)
          .then(compressedBlob => {
              const convertedBlobFile = new File([compressedBlob], fileName, { type: filetype, lastModified: Date.now()})
              console.log(convertedBlobFile);
              setlogoImg(convertedBlobFile);
              //fileArray.push(convertedBlobFile);
              setlogoImgUrl(imageUrl);
              //setfilechangeStatus(fileArray);
              alertMsg("Logo Image accepted", "success");
          })
          .catch(e => {
            throw alertMsg(e.message, "error");
          })
           
        }

      }else {
        alertMsg("The image should be less than 150kb", "error");
      }
    }else {
      alertMsg("The selected file type is not allowed", "error");
    }
  };

  const checkImgs = () => { 
    var images:any = [];
    var name:any = [];
    if(logoImg && faviconImg) {
      images = [logoImg, faviconImg];
      name = ['logo.jpeg', 'favicon.jpeg'];
    }else if(logoImg) {
      images = [logoImg];
      name = ['logo.jpeg'];
    }else if(faviconImg) {
      images = [faviconImg];
      name = ['favicon.jpeg'];
    }
    return {images,name};
  }

  const uploadImages = async () => {
    const {images, name} = checkImgs();
    console.log(images);
    if(images.length == 0) {
      return true;
    }else {

      for(var i = 0 ; i < images.length; i++) {
        
        const imagepath = 'public/'+authId+'/images/'+name[i];
  
        const { data, error } = await supabaseClient.storage
        .from('authors')
        .upload(imagepath, images[i], {
          upsert: true,
        });
        if(error) throw alertMsg(error.message, "error");
        if(data) {
          const { publicURL, error } = await supabaseClient.storage
          .from('authors')
          .getPublicUrl(imagepath);
          if(error) throw alertMsg(error.message, "error");
          if(publicURL) {
            console.log(publicURL);
            const mainurl = publicURL + '?' + new Date().getTime();
            (name[i] == 'logo.jpeg') ? logo = mainurl : favicon = mainurl;
          }
          //setbtnLoading(false);
        }
      }
      return true;

    }
      

  }

  const updateProfile = (e:any) => {
      e.preventDefault();
      setbtnDisabled(true);
      setbtnLoading(true);
      uploadImages().then(async () => {
        console.log(logo);
        console.log(favicon);
        if(nameError == true) {
          alertMsg("Blog name can only containers lowercase alphabets & digits", "error");
        }else {

          const { data, error } = await supabaseClient.from('authors').update({ 
            title: title,
            description: description,
            username: name,
            logoimg: logo,
            faviconimg: favicon,  
          }).eq('id', authId);
          if(error) throw alertMsg(error.message, "error");
          if(data) {
            alertMsg("Profile updated successfully", "success");
          }

        }

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
          <label className="block">
            <Label>Blog Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" type="text" className="mt-1" />
          </label>
          <label className="block">
            <Label>Blog Name</Label>
            <Input value={name} onChange={handleName} placeholder="blogname.stensil.com" type="text" className="mt-1" />
          </label>
          <label className="block md:col-span-2">
            <Label>Blog Description</Label>
  
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={4} />
            <p className="mt-1 text-sm text-neutral-500">
              Brief description for your blog.
            </p>
          </label>
          <div className="block md:col-span-2">
            <Label>Blog Logo</Label>
  
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
              <img style={{backgroundSize: 'cover'}} className="mx-auto text-neutral-400" alt="svgImg" src={logoImgUrl}/>
                <div className="flex flex-col sm:flex-row text-sm text-neutral-6000 text-center justify-center">
                  <label
                    htmlFor="logo-upload"
                    className="relative text-center cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e:any) => loadImage(URL.createObjectURL(e.target.files[0]), e, "logo")}  
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-center text-neutral-500">
                    PNG, JPG, GIF up to 2MB
                </p>
              </div>
            </div>
          </div>
          <div className="block md:col-span-2">
            <Label>Blog Favicon</Label>
  
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <img className="mx-auto h-12 w-12 text-neutral-400" alt="svgImg" src={faviconImgUrl}/>
                <div className="flex flex-col sm:flex-row text-sm text-neutral-6000 text-center justify-center">
                  <label
                    htmlFor="favicon-upload"
                    className="relative text-center cursor-pointer rounded-md font-medium text-primary-6000 hover:text-primary-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="favicon-upload"
                      name="favicon-upload"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e:any) => loadImage(URL.createObjectURL(e.target.files[0]), e, "favicon")}  
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-center text-neutral-500">
                  Only images of Dimensions 48x48, 32x32, 16x16 are accepted
                </p>
              </div>
            </div>
          </div>
          <ButtonPrimary onClick={updateProfile} disabled={btnDisabled} loading={btnLoading} className="md:col-span-2" type="submit">
            Update profile
          </ButtonPrimary>
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

export default DashboardEditProfile;
