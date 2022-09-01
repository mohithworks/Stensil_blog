import LayoutPage from "components/LayoutPage/LayoutPage";
import React, { FC, useState, useEffect } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import Input from "components/Input/Input";
import ButtonPrimary from "components/Button/ButtonPrimary";
import NcLink from "components/NcLink/NcLink";
import { Helmet } from "react-helmet";
import Collapse from '@mui/material/Collapse';
import {Alert} from "components/Alert/Alert";
import supabaseClient from "utils/supabaseClient";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from 'utils/context';

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Google",
    provider: "google",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [showAlert, setshowAlert] = useState(false);
  const [alertType, setalertType] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errortxt, setErrortxt] = useState("");
  const { user, setUser } = useGlobalContext();

  const navigate = useHistory();

  const alertMsg = (val: string, errtype: string) => {
    setErrortxt(val);
    setalertType("error");
    setshowAlert(true);
    setbtnLoading(false);
  }

  const emailSignin = async (e: any) => {
    e.preventDefault();
    if(email === "" || pwd === "") {
      alertMsg("Email/Password is empty", "error");
    }else {
      setErrortxt("");
      setshowAlert(false);
      setbtnLoading(true);
      const { user, session, error } = await supabaseClient.auth.signIn({
        email: email,
        password: pwd,
      })
      if(error) throw alertMsg(error.message, "error");
      if(user) {
        setUser(user);
        setbtnLoading(false);
        navigate.push("../");
      }
    }
  }

  const socialSignin = async (provider: string) => {
    if(provider == 'google') {
      const { user, session, error } = await supabaseClient.auth.signIn({
        provider: 'google'
      },
      {
        scopes: 'https://www.googleapis.com/auth/drive.readonly',
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

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login || Blog Magazine React Template</title>
      </Helmet>
      <LayoutPage
        subHeading="Welcome to our blog magazine Community"
        headingEmoji="🔑"
        heading="Login"
      >
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                onClick={() => socialSignin(item.provider)}
                className="flex w-full cursor-pointer rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
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
          {/* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}
          {/* FORM */}
          {/* <form className="grid grid-cols-1 gap-6" action="#" method="post">
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
                <NcLink to="/forgot-pass" className="text-sm">
                  Forgot password?
                </NcLink>
              </span>
              <Input type="password" className="mt-1"
                onChange={(e: any) => setPwd(e.target.value)} />
            </label>
            <ButtonPrimary loading={btnLoading} type="submit" onClick={(e:any) => emailSignin(e)}>Continue</ButtonPrimary>
          </form> */}

          {/* ==== */}
          {/* <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <NcLink to="/signup">Create an account</NcLink>
          </span> */}
        </div>
      </LayoutPage>
    </div>
  );
};

export default PageLogin;
