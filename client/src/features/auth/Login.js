import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

import usePersist from '../../hooks/usePersist'

export default function Login() {

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // we use unwrap() to catch the error with try-catch block instead of using isError and error from the mutation
            const { accessToken } = await login({ username, password }).unwrap()
//////////////////////////////////////////////////
            dispatch(setCredentials( accessToken )) // if we put dispatch(setCredentials( {accessToken} )) then we have to modify baseQuery in apiSlice.js to extract the token string from the object created
/////////////////////////////////////////////////
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    if (isLoading) return <p>Loading...</p>

    return(
        <div>
            <h1>Login page</h1>

            <p ref={errRef} aria-live="assertive">{errMsg}</p>

            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off" //so that it doesn't show other usernames that have been entered
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                </label>
                <br />
                <button>Sign in</button>
                <br />

                <label htmlFor="persist">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={handleToggle}
                        checked={persist}
                    />
                        Trust This Device
                    </label>

            </form>
            <Link to="/">Back to Home</Link>
        </div>
    )
}