import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function DashFooter() {

    const { username, status } = useAuth()

    const navigate = useNavigate()
    const {pathname} = useLocation()

    const goHome = () => navigate('/dash')

    let goHomeButton = null
    if(pathname !== '/dash') {
        goHomeButton = (
            <button onClick={goHome}>Home</button>
        )
    }

    return(
        <footer className='dash-footer'>
            <h3>Dash footer</h3>
            {goHomeButton}
            <p>Curent user: {username}</p>
            <p>Status: {status}</p>
        </footer>
    )
}