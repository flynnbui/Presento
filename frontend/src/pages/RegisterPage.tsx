import { LoginRegisterTextField } from '@/components/ui/textfield';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import validator from 'validator';
import { useNavigate } from "react-router-dom";
import { useContext, Context} from '../context'
import { AlertRet } from "@/components/ui/alert"
import { Store } from '@/helpers/serverHelpers'
import api from '@/config/axios'

function RegisterPage() {
  const navigate = useNavigate();
  
  const { getters, setters } = useContext(Context)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if (getters.loginState ) {
      navigate('/dashboard')
    }
  }, [getters.loginState, navigate])

  async function setUpUser(email: string, name: string) {
    try{
      const data: Store = {
          user: {email, name, presentations: []},
          presentations: [],
          history: []
      }
      await api.put('/store', {store: data})
      setters.setUserData(data)
    } catch (e) {
      const error = e as { response: { data: { error: string } } }
      setAlert(AlertRet("Store Error", error.response.data.error))
    }
  }

  async function registerUser() {
    if (name.length === 0) {
      setAlert(AlertRet("Registration Error", "Enter your name"))
      return
    }
    else if (!validator.isEmail(email)) {
      setAlert(AlertRet("Registration Error", "Enter a valid email"))
      return
    }
    else if (password.length === 0) {
      setAlert(AlertRet("Registration Error", "Enter your password"))
      return
    }

    try {
      const response = await api.post('/admin/auth/register', { email, password, name})
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        setters.setLogin(true)
        setUpUser(email, name)
      }
    } catch (e) {
      const error = e as { response: { data: { error: string } } }
      setAlert(AlertRet("Registration Error", error.response.data.error))
    }
  }
  return (
    <>
    <div className="w-screen h-screen grid grid-rows-10 grid-cols-12">

      {/* Register Section */}
      <div className="h-full col-start-1 col-span-8 row-start-1 row-span-10">

        <div className="h-full grid grid-rows-12 grid-cols-12">
          <div className="col-start-4 col-span-6 row-start-2 row-span-1">
            <h1 className="text-2xl font-bold text-white m-auto text-center">P r e s t o</h1>
          </div>

          {/* Alert section */}
          {alert && <div className='col-start-4 col-span-6 row-start-3 row-span-1'>{alert}</div>}

          <LoginRegisterTextField
            placeholder='Name'
            className='col-start-4 col-span-6 row-start-5 row-span-1'
            onChange={(name) => setName(name.target.value)}
          />
          <LoginRegisterTextField
            placeholder='Email'
            className='col-start-4 col-span-6 row-start-7 row-span-1'
            onChange={(email) => setEmail(email.target.value)}
          />
          <LoginRegisterTextField
            placeholder='Password'
            className='col-start-4 col-span-6 row-start-9 row-span-1'
            type="password"
            onChange={(password) => setPassword(password.target.value)}
          />
        
          <Button className="dark:bg-gray-300 shadow dark:hover:bg-zinc-500 col-start-4 col-span-6 row-start-11 row-span-1" onClick={() => registerUser()}>Register</Button>
        </div>
      </div>

      {/* Switch Login Section */}
      <div className="h-full col-start-9 col-span-4 row-start-1 row-span-10 bg-gray-800 grid grid-rows-12 grid-cols-5">
        <div className="text-white text-xl col-start-2 col-span-3 row-start-5 row-span 1 text-center">
          Already have an account?
        </div>
        <Button className="dark:bg-gray-300 shadow dark:hover:bg-zinc-500 col-start-2 col-span-3 row-start-7 row-span-1" onClick={() => navigate("/login")}>Log In</Button>
      </div>
    </div>
    </>
    )
  }
  
export default RegisterPage