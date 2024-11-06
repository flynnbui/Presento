import { useContext, Context} from '../context'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function logoutPage() {
    const { getters, setters } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem('token')
        setters.setLogin(false)
        navigate('/login')
    }, [getters.loginState, navigate])
    return (
        <>
        </>
    )
}

export default logoutPage