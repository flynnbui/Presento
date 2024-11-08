import React, { createContext, Dispatch, SetStateAction } from 'react'
import { Store } from '@/helpers/serverHelpers'

export interface ContextType {
    getters: {
      loginState: boolean;
      userData?: Store;
    };
    setters: {
      setLogin: Dispatch<SetStateAction<boolean>>;
      setUserData: Dispatch<SetStateAction<Store | undefined>>;
    };
  }

export const initialValue:ContextType = {
    getters: {
        loginState: localStorage.getItem('token') !== null,
        userData: undefined
    },
    setters: {
        setLogin: () => {},
        setUserData: () => {}
    }
}

export const Context = createContext(initialValue)
export const useContext = React.useContext