import React, { createContext, Dispatch, SetStateAction } from 'react'

interface ContextType {
    getters: {
      loginState: boolean;
    };
    setters: {
      setLogin: Dispatch<SetStateAction<boolean>>;
    };
  }

export const initialValue:ContextType = {
    getters: {
        loginState: localStorage.getItem('token') !== null
    },
    setters: {
        setLogin: () => {}
    }
}

export const Context = createContext(initialValue)
export const useContext = React.useContext