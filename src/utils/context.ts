import { createContext, useContext } from "react";

export type GlobalContent = {
  user: any
  setUser:(c: any) => void
  event: any
  setEvent:(c: any) => void
  loading: any
  setLoading:(c: any) => void
}

export const MyGlobalContext = createContext<GlobalContent>({
    user: 'Hello World', // set a default value
    setUser: () => {},
    event: 'Hello World', // set a default value
    setEvent: () => {},
    loading: 'Hello World', // set a default value
    setLoading: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);