import { LoginRegisterTextField } from '@/components/ui/textfield';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import validator from 'validator';
import { useNavigate } from "react-router-dom";
import { fetchBackend, fetchStore } from '@/helpers/serverHelpers';
import { useContext, Context} from '../context'

function LoginPage() {
  const navigate = useNavigate();
  
  const { getters, setters } = useContext(Context)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (getters.loginState ) {
      navigate('/dashboard')
    }
  }, [getters.loginState, navigate])

  function loginUser() {
    if (!validator.isEmail(email)) {
      console.log("EMAIL")
      return
    }
    if (password.length === 0) {
      console.log("PASSWORD")
      return
    }
 
    fetchBackend('/admin/auth/login', 'POST', { email, password, name })
      .then(response => {
        if (!response.ok) {
          console.log('Failed to log in user');
        } else {
          response.json().then(data => {
            setters.setLogin(true)
            localStorage.setItem("token", data.token)
            console.log('User log in successfully:', getters.loginState);
            fetchStore().then(data => console.log(data.store))
          })
          .catch(err => {
            console.log(err.message);
          })
        }
      })
  }

  return (
    <>
    <div className="w-screen h-screen grid grid-rows-10 grid-cols-12">

      {/* Login Section */}
      <div className="h-full col-start-1 col-span-8 row-start-1 row-span-10">

        <div className="h-full grid grid-rows-12 grid-cols-12">
          <div className="col-start-4 col-span-6 row-start-3 row-span-1">
            <h1 className="text-2xl font-bold text-white m-auto text-center">P r e s t o</h1>
          </div>

          <LoginRegisterTextField
            placeholder='Email'
            className='col-start-4 col-span-6 row-start-5 row-span-1'
            onChange={(email) => setEmail(email.target.value)}
          />
          <LoginRegisterTextField
            placeholder='Password'
            className='col-start-4 col-span-6 row-start-7 row-span-1'
            type="password"
            onChange={(password) => setPassword(password.target.value)}
          />

          <Button className="dark:bg-gray-300 shadow dark:hover:bg-zinc-500 col-start-4 col-span-6 row-start-9 row-span-1" onClick={() => loginUser()}>Log In</Button>
        </div>
      </div>

      {/* Switch Register Section */}
      <div className="h-full col-start-9 col-span-4 row-start-1 row-span-10 bg-gray-800 grid grid-rows-12 grid-cols-5">
        <div className="text-white text-xl col-start-2 col-span-3 row-start-5 row-span 1 text-center">
          Don't have an account yet?
        </div>
        <Button className="dark:bg-gray-300 shadow dark:hover:bg-zinc-500 col-start-2 col-span-3 row-start-7 row-span-1" onClick={() => navigate("/register")}>Register Now</Button>
      </div>
    </div>
    </>
  )
}

export default LoginPage