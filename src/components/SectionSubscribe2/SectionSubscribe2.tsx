import React, { FC, useRef, useState } from "react";
import ButtonPrimary from "components/Button/ButtonPrimary";
import rightImg from "images/SVG-subcribe2.png";
import NcImage from "components/NcImage/NcImage";
import Badge from "components/Badge/Badge";
import Input from "components/Input/Input";
import Snackbar from '@mui/material/Snackbar';
import supabaseClient from "utils/supabaseClient";
import { useGlobalContext } from 'utils/context';

export interface SectionSubscribe2Props {
  className?: string;
}

const SectionSubscribe2: FC<SectionSubscribe2Props> = ({ className = "" }) => {
  const { author } = useGlobalContext();

  const subName = useRef<any>(null);
  const subEmail = useRef<any>(null);

  const [btnLoading, setbtnLoading] = useState<any>(false);
  const [snackStatus, setsnackStatus] = useState<any>(false);
  const [snackMsg, setsnackMsg] = useState<any>("");

  const setSnack = (msg: any) => { 
    setsnackMsg(msg);
    setsnackStatus(true);
    setbtnLoading(false);
    setTimeout(() => {
      setsnackStatus(false);
    }, 3000);
  }

  const subscribe = async (e:any) => { 
    e.preventDefault(); 
    setbtnLoading(true);
    console.log(author[0].id);
    const nameS = subName.current.value;
    const emailS = subEmail.current.value;

    if(nameS === "" || emailS === ""){
      setSnack("Please fill all fields")
    } else {
      const subData:any = await supabaseClient
      .from('newsletter')
      .select("email")
      .eq('email', emailS)
      .eq('author', author[0].id)

      if(subData.error) {
        setSnack(subData.error.message)
      }
      console.log(subData.data);
      if(subData.data.length > 0) {
        setSnack("You are already subscribed")
      } else { 

        const { data, error } = await supabaseClient
        .from('newsletter')
        .insert([
          { name: nameS, email: emailS, author: author[0].id },
        ])
  
        if(error){
          setSnack(error.message);
        } 
        if(data) { 
          setSnack("Subscribed successfully. You will receive an email from author shortly.");
        }
      }

    }

  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setsnackStatus(false);
  };

  return (
    <div
      className={`nc-SectionSubscribe2 relative flex flex-col lg:flex-row items-center ${className}`}
      data-nc-id="SectionSubscribe2"
    >
      <div className="flex-shrink-0 mb-14 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2 className="font-semibold text-4xl">Join our newsletter 🎉</h2>
        <span className="block mt-6 text-neutral-500 dark:text-neutral-400">
          Read and share new perspectives on just about any topic. Everyone’s
          welcome.
        </span>
        {/* <ul className="space-y-5 mt-10">
          <li className="flex items-center space-x-4">
            <Badge name="01" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Get more discount
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <Badge color="red" name="02" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Get premium magazines
            </span>
          </li>
        </ul> */}
        <form onSubmit={subscribe} className="mt-10 relative max-w-sm">
          <div className="flex flex-row items-center space-x-4 mb-5">
            <Badge name="01" />
            <Input
              ref={subName}
              required
              aria-required
              placeholder="Enter your Name"
              type="text"
            />
          </div>
          <div className="flex flex-row items-center space-x-4">
            <Badge color="red" name="02" />
            <Input
              ref={subEmail}
              required
              aria-required
              placeholder="Enter your email"
              type="email"
            />
          </div>
          <ButtonPrimary loading={btnLoading} className="mt-10 h-10 w-full"
            type="submit"
          >
            Submit
          </ButtonPrimary>
        </form>
      </div>
      <div className="flex-grow">
        <NcImage src={rightImg} />
      </div>
      <Snackbar
        open={snackStatus}
        onClose={handleClose}
        message={snackMsg}
      />
    </div>
  );
};

export default SectionSubscribe2;
