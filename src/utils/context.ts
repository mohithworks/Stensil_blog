import { createContext, useContext } from "react";

export type GlobalContent = {
  author: any
  setAuthor:(c: any) => void
  post: any
  setPost:(c: any) => void
  navigation: any
  setNavigation:(c: any) => void
  initpostRange: any
  finpostRange: any
}

export const MyGlobalContext = createContext<GlobalContent>({
  author: 'Hello World', // set a default value
  setAuthor: () => {},
  post: 'Hello World', // set a default value
  setPost: () => {},
  navigation: 'Hello World', // set a default value
  setNavigation: () => {},
  initpostRange: 0,
  finpostRange: 0
});

export const useGlobalContext = () => useContext(MyGlobalContext);