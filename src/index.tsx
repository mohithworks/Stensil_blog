import React, { Suspense } from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ReactDOM from "react-dom/client";
import supabaseClient from "./utils/supabaseClient";
import getAuthorSlug from "./utils/getAuthorSlug";

// STYLE
import "./index.css";
import "./styles/index.scss";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
//
const RtlImportCssLazy = React.lazy(() => import("RtlImportCss"));
document
  .getElementsByTagName("html")[0]
  .setAttribute("dir", import.meta.env.VITE_LRT_OR_RTL);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
 
const initpostRange = 0, finpostRange = 10;

const authorSlug = getAuthorSlug();

const supabaseFetch = async (table: string, query: string, type: string, authorSlug: string) => {
  const { data, error } = await supabaseClient.from(table).select(query).eq(type, authorSlug);

  return { error, data };
};

const returnFun = (error: any, posts: any, authors: any, nav: any, currentPost: any) => { 
  return { error: error, posts: posts, authors: authors, nav: nav, currentpost: currentPost };
}

const fetchPost = async (authorSlug: string) => {
  var posts: any = await supabaseClient
    .from("posts")
    .select(
      "*, authors!inner(*), category!inner(*), refauthors!inner(*)",
    )
    .eq("authors.username", authorSlug)
    .range(initpostRange, finpostRange)
    .order("created_at", { ascending: false });

  var nav: any = await supabaseFetch("navigationv2", "*, authors!inner(*)", "authors.username", authorSlug);

  if (posts.error || nav.error) {

    return returnFun("Please check your internet connection & refresh the page", null, [], null, null);

  }else if (posts.data.length == 0) {

    const authors: any = await supabaseFetch("authors", "*", "username", authorSlug);

    if (authors.error) {
      return returnFun("Please check your internet connection & refresh the page", null, [], null, null);
    }
    
    return returnFun(null, null, [authors.data], nav.data, null);

  } else if (posts.data && nav.data) {
    //const urlPath = window.location.pathname;

    // if(urlPath.search("/posts/") != -1) { 
    //   const postId = urlPath.split("/posts/")[1].split("/")[0];
    //   var currentPost:any = await supabaseClient.from("posts").select(`*, authors!inner(*), category!inner(*), refauthors!inner(*)`).eq("posttitle", postId);

    //   if (currentPost.error) {
    //     return returnFun("Please check your internet connection & refresh the page", null, [], null, null);
    //   }
      
    //   return returnFun(null, posts.data, [posts.data[0].authors], nav.data, currentPost.data);
    // }

    return returnFun(null, posts.data, [posts.data[0].authors], nav.data, posts.data[0]);

  }
};



fetchPost(authorSlug).then((data) => { 
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App data={data} />
  
        {/* LOAD RTL CSS WHEN RTL MODE ENABLE */}
        {import.meta.env.VITE_LRT_OR_RTL === "rtl" && (
          <Suspense fallback={<div />}>
            <RtlImportCssLazy />
          </Suspense>
        )}
      </PersistGate>
    </Provider>
    // </React.StrictMode>
  );

});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
