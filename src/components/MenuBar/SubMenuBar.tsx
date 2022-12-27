import React, { useState, Fragment, useEffect } from "react";
import { Transition, Popover } from "@headlessui/react";
import SubNavMobile from "components/Navigation/SubNavMobile";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from 'utils/context';
import { Link } from "react-router-dom";
import SubLogo from "components/Logo/SubLogo";
import { NavItemType } from "components/Navigation/NavigationItem";
import SubSocialList from "components/SocialsList/SubSocialList";
import DarkModeContainer from "containers/DarkModeContainer/DarkModeContainer";
import ButtonClose from "components/ButtonClose/ButtonClose";

export interface MenuBarProps {
    navigations?: any,
    username?: any,
    description?: any,
    logo?: any,
    buttons?: any,
}
const SubMenuBar: React.FC<MenuBarProps> = ({ navigations, username, description, logo, buttons }) => {
  const [isVisable, setIsVisable] = useState(false);
  const location = useLocation();
  const { navigation } = useGlobalContext();

  const socials = navigation?.filter(function(obj:any) {
    return obj.type == "Social Icon";
  }); 

  useEffect(() => {
    setIsVisable(false);
  }, [location.pathname]);

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);
  const solutions = [
    {
      name: 'Analytics',
      description: 'Get a better understanding of where your traffic is coming from.',
      href: '#',
    },
    {
      name: 'Engagement',
      description: 'Speak directly to your customers in a more meaningful way.',
      href: '#',
    },
    { name: 'Security', description: "Your customers' data will be safe and secure.", href: '#' },
    {
      name: 'Integrations',
      description: "Connect with third-party tools that you're already using.",
      href: '#',
    },
    {
      name: 'Automations',
      description: 'Build strategic funnels that will drive your customers to convert',
      href: '#',
    },
  ]
  const callsToAction = [
    { name: 'Watch Demo', href: '#' },
    { name: 'Contact Sales', href: '#' },
  ]
  const resources = [
    {
      name: 'Help Center',
      description: 'Get all of your questions answered in our forums or contact support.',
      href: '#',
    },
    {
      name: 'Guides',
      description: 'Learn how to maximize our platform to get the most out of it.',
      href: '#',
    },
    {
      name: 'Events',
      description: 'See what meet-ups and other events we might be planning near you.',
      href: '#',
    },
    { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#' },
  ]
  const recentPosts = [
    { id: 1, name: 'Boost your conversion rate', href: '#' },
    { id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#' },
    { id: 3, name: 'Improve your customer experience', href: '#' },
  ]

  
  const _renderItemNoChild = (
    item: any,
    index: any,
    isChild: boolean
  ) => {
    return (
      <li key={index} className="text-neutral-900 dark:text-white">
        <a
          target="_blank"
          className={`flex w-full items-center py-2.5 px-4 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg`}
          href={item.link}
        >
          {item.name}
        </a>
      </li>
    );
  };

  const _renderItem = (item: NavItemType, index: number, isChild: boolean) => {
    return _renderItemNoChild(item, index, isChild);
  };
  
  const renderContent = () => {
    return (
      <>
       <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
       <Popover.Panel focus className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden">
          <div className=" rounded-lg bg-white dark:bg-neutral-700 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="pl-5 pr-3 pt-5 pb-6">
              <div className="items-center">
                <div>
                  {
                    logo == null ? 
                    
                    <Link to="/" className="ttnc-logo mt-5 inline-block">
                      <h2 className={`text-2xl md:text-2xl font-semibold`}>{username.toUpperCase()}</h2>
                    </Link>
                    :
                    <SubLogo img={logo} />
                  }
                </div>
                <p className="mt-3 pl-1">
                  {description}
                </p>
              </div>
              <div className="mt-6 pr-2">
                <nav className="grid gap-y-8">
                  <ul className="">
                    {navigations.map((item:any, index:any) => _renderItem(item, index, false))}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="space-y-6 py-6 px-5">
              
              <div className="flex justify-between items-center mt-4">
                <SubSocialList socials={socials} itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
                <span>
                  <DarkModeContainer className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800" />
                </span>
              </div>
              {
                buttons.length != 0 && (
                  <div>
                    <a
                      href={buttons[0].link}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      {buttons[0].name}
                    </a>
                  </div>  
                )
              }
            </div>
            
            <div className="absolute right-2 top-2 p-1">
              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-neutral-700 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                 <ButtonClose />
              </Popover.Button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
      {/* <Transition show={isVisable} as={Fragment}>
        <div className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter=" duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave=" duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-neutral-900 bg-opacity-50 "
              onClick={handleCloseMenu}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition duration-100 transform"
            enterFrom="opacity-0 -translate-x-14"
            enterTo="opacity-100 translate-x-0"
            leave="transition duration-150 transform"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-14"
          >
            <div className="fixed inset-y-0 left-0 w-screen max-w-sm overflow-y-auto z-50">
              <div className="flex min-h-full">
                <div className="w-full max-w-sm overflow-hidden transition-all">
                  <SubNavMobile socials={socials} username={username} logo={logo} description={description} data={navigations} onClickClose={handleCloseMenu} />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition> */}
      </>
    );
  };

  return (
    <Popover>
      <Popover.Button
        // onClick={() => {
        //   setIsVisable(!isVisable);
        // }}
        className="p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </Popover.Button>

      {renderContent()}
    </Popover>
  );
};

export default SubMenuBar;
