import LayoutPage from "components/LayoutPage/LayoutPage";
import React, { ComponentType, FC, useState, useEffect } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import DashboardNavigation from "./DashboardNavigation";
import DashboardEditProfile from "./DashboardEditProfile";
import DashboardPosts from "./DashboardPosts";
import DashboardRoot from "./DashboardRoot";
import DashboardCategories from "./DashboardCategories";
import DashboardSubmitPost from "./DashboardSubmitPost";
import { Helmet } from "react-helmet";
import ButtonPrimary from "components/Button/ButtonPrimary";
import { GdocsContext } from "utils/gdocscontext"; 
import supabaseClient from "utils/supabaseClient";

export interface PageDashboardProps {
  className?: string;
}

interface DashboardLocationState {
  "/root"?: {};
  "/posts"?: {};
  "/edit-profile"?: {};
  "/categories"?: {};
  "/navigation"?: {};
  "/submit-post"?: {};
  "/account"?: {};
}

interface DashboardPage {
  sPath: keyof DashboardLocationState;
  exact?: boolean;
  component: ComponentType<Object>;
  emoij: string;
  pageName: string;
}

const subPages: DashboardPage[] = [
  {
    sPath: "/root",
    exact: true,
    component: DashboardRoot,
    emoij: "🕹",
    pageName: "Dashboard",
  },
  {
    sPath: "/posts",
    component: DashboardPosts,
    emoij: "📕",
    pageName: "Posts",
  },
  {
    sPath: "/edit-profile",
    component: DashboardEditProfile,
    emoij: "🛠",
    pageName: "Edit profile",
  },
  {
    sPath: "/categories",
    component: DashboardCategories,
    emoij: "📃",
    pageName: "Categories",
  },
  {
    sPath: "/navigation",
    component: DashboardNavigation,
    emoij: "✈",
    pageName: "Navigation",
  },
  {
    sPath: "/submit-post",
    component: DashboardSubmitPost,
    emoij: "✍",
    pageName: "Create a post",
  },
];

const PageDashboard: FC<PageDashboardProps> = ({ className = "" }) => {
  let { path, url } = useRouteMatch();
  //"You have created a new client application that uses libraries for user authentication or authorization that will soon be deprecated. New clients must use the new libraries instead; existing clients must also migrate before these libraries are deprecated. See the [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration) for more information."
  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: import.meta.env.VITE_GAUTHDOCS_CLIENTID,
  //       scope: 'https://www.googleapis.com/auth/drive.readonly',
  //     });
  //   }

  //   gapi.load('client:auth2', start);
  // }, []);

  const [btntxt, setbtntxt] = useState("Connect your Google Docs Account");
  const [user, setUser] = useState();
  
  var usrdata:any = '';

  const responseGoogle = (response: any) => {
    usrdata = response;
    console.log(usrdata);
    setUser(usrdata);
    setbtntxt("Reconnect your Google Docs Account");
  }
  const responseGoogle2 = (response: any) => {
    console.log(response);
    setbtntxt("Reconnect your Google Docs Account");
  }

  return (
    <div className={`nc-PageDashboard ${className}`} data-nc-id="PageDashboard">
      <Helmet>
        <title>Dashboard || Blog Magazine React Template</title>
      </Helmet>
      <LayoutPage
        subHeading="View your dashboard, manage your Posts, Subscription, edit password and profile"
        headingEmoji="⚙"
        heading="Dashboard"
      >
          {/* <div className="items-center text-center">
            <GoogleLogin
              clientId={import.meta.env.VITE_GAUTHDOCS_CLIENTID}
              render={renderProps => (
                
                <ButtonPrimary onClick={renderProps.onClick} disabled={renderProps.disabled} className="md:col-span-2 mb-20" type="submit">
                  {btntxt}
                </ButtonPrimary>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle2}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
          </div> */}
          {/* <GdocsContext.Provider value={{ user, setUser }}> */}
            <div className="flex flex-col space-y-8 xl:space-y-0 xl:flex-row">
              {/* SIDEBAR */}
              <div className="flex-shrink-0 max-w-xl xl:w-80 xl:pr-8">
                <ul className="text-base space-y-1 text-neutral-6000 dark:text-neutral-400">
                  {subPages.map(({ sPath, pageName, emoij }, index) => {
                    return (
                      <li key={index}>
                        <NavLink
                          className="flex px-6 py-2.5 font-medium rounded-lg hover:text-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                          to={`${url}${sPath}`}
                          activeClassName="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        >
                          <span className="w-8 mr-1">{emoij}</span>
                          {pageName}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border border-neutral-100 dark:border-neutral-800 md:hidden"></div>
              <div className="flex-grow">
                <Switch>
                  {subPages.map(({ component, sPath, exact }, index) => {
                    return (
                      <Route
                        key={index}
                        exact={exact}
                        component={component}
                        path={!!sPath ? `${path}${sPath}` : path}
                      />
                    );
                  })}
                  <Redirect to={path + "/root"} />
                </Switch>
              </div>
            </div>
          {/* </GdocsContext.Provider> */}
      </LayoutPage>
    </div>
  );
};

export default PageDashboard;
