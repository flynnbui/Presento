import React from 'react'
import { RouterProvider } from 'react-router-dom';
import { router } from './config/router';
import { Context, initialValue } from './context'

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
        <div className="bg-zinc-900 h-screen dark">
            <Context.Provider value={{ getters, setters }}>
                <RouterProvider router={router} />
            </Context.Provider>
        </div>
    );
}

export default App;
