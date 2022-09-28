import React, { FC, useState } from "react";
import LayoutPage from "components/LayoutPage/LayoutPage";
import {Alert} from "components/Alert/Alert";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import Input from "components/Input/Input";
import ButtonPrimary from "components/Button/ButtonPrimary";
import NcLink from "components/NcLink/NcLink";
import { Helmet } from "react-helmet";
import Collapse from '@mui/material/Collapse';
import supabaseClient from 'utils/supabaseClient';
import checkDetails from "utils/checkDetails";
import { useGlobalContext } from 'utils/context';

export interface PageSignUpProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Google",
    provider: 'google',
    icon: googleSvg,
  },
];

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const [showAlert, setshowAlert] = useState(false);
  const [alertType, setalertType] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [errortxt, setErrortxt] = useState("");
  const { user, setUser } = useGlobalContext();
  
  const alertMsg = (val: string, errtype: string) => {
    setErrortxt(val);
    setalertType(errtype);
    setshowAlert(true);
    setbtnLoading(false);
  }

  const socialSignup = async (provider: string) => {
    if(provider == 'google') {
      const { user, session, error } = await supabaseClient.auth.signIn({
        provider: 'google'
      })
      if(error) throw alertMsg(error.message, "error");
      setUser(user);
      console.log(user);
    } 
    // else if(provider == "facebook") {
    //   const { user, session, error } = await supabaseClient.auth.signIn({
    //     // https://vwporhpsnujzncbdxtaj.supabase.co/auth/v1/authorize?provider=google
    //     provider: 'facebook'
    //   })
    //   if(error) throw alertMsg(error.message, "error");
    //   console.log(user);
    // }
  }

  const emailSignup = async (e:any) => {
    e.preventDefault();
    const emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,30}$/;
    const fnameReg = /^([a-zA-Z ]){3,30}$/;
    const lnameReg = /^([a-zA-Z ]){1,30}$/;
    setFullname(fname + " " + lname);

    if(email == ""||pwd == ""||fname == ""||lname == "") {
      alertMsg("All the fields are required", "error");
    }else if(!email.match(emailReg)) {
      alertMsg("Email is invalid", "error");
    }else if(!pwd.match(passwordReg)) {
      alertMsg("Your password must be at least 6 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character", "error");
    }else if(!fname.match(fnameReg)) {
      alertMsg("Firstname entered is invalid", "error");
    }else if(!lname.match(lnameReg)) {
      alertMsg("Lastname entered is invalid", "error");
    }else {
      setErrortxt(""); 
      setshowAlert(false);
      setbtnLoading(true);
      checkDetails(email, "email", "email", "authors").then(async (res) => {
        if(res.email == email) {
          alertMsg("User already exists", "error");
        }else if(res.code && res.code == "PGRST116") {

          const { user, session, error } = await supabaseClient.auth.signUp(
            {
              email: email, password: pwd,
            },
            {
              data: { 
                full_name: fullname, avatar_url: "",
              }
            }
          )
          if(error) throw alertMsg(error.message, "error");
          console.log(user);
          alertMsg("Your account was succesfully created. Please check your email to verify your account", "success");
          console.log("Session: " + session);

        }

      })
    }
  }

  return (
    <div className={`nc-PageSignUp ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Blog Magazine React Template</title>
      </Helmet>
      <LayoutPage
        subHeading="Welcome to our blog magazine Community"
        headingEmoji="🎉"
        heading="Sign up"
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                onClick={() => socialSignup(item.provider)}
                className=" flex w-full cursor-pointer rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <Collapse in={showAlert}>
              <Alert containerClassName="block" type={alertType} children={errortxt} onClick={(e: any) => {
                e.preventDefault();
                setshowAlert(false)
                }}/>
            </Collapse>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input 
                type="password" 
                className="mt-1"
                onChange={(e: any) => setPwd(e.target.value)}
               />
            </label>
            <label className="block flex justify-between items-center">
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Firstname
                </span>
                <Input type="text" className="mt-1" 
                  onChange={(e: any) => setFname(e.target.value)}/>
              </label>
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Lastname
                </span>
                <Input type="text" className="mt-1" 
                  onChange={(e: any) => setLname(e.target.value)}/>
              </label>
            </label>
            <ButtonPrimary loading={btnLoading} type="submit" onClick={(e:any) => emailSignup(e)}>Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <NcLink to="/login">Sign in</NcLink>
          </span>
        </div>
      </LayoutPage>
    </div>
  );
};

export default PageSignUp;
