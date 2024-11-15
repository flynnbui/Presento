import { RouterProvider } from 'react-router-dom';
import { router } from './config/router';
import { Context, initialValue } from './context';
import React from 'react';

function App() {
  const [loginState, setLogin] = React.useState(initialValue.getters.loginState)
  const [userData, setUserData] = React.useState(initialValue.getters.userData)
  const getters = {
    loginState,
    userData
  };
  const setters = {
    setLogin: setLogin,
    setUserData: setUserData
  };
  return (
    <Context.Provider value={{ getters, setters }}>
      <div className="bg-zinc-900 h-screen">
        <RouterProvider router={router} />
      </div>
    </Context.Provider>
  );
}

export default App;
