import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

export default function DashHeader() {

    const {isManager, isAdmin} = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    //const onLogoutClicked = () => sendLogout()
    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header-buttons"
    }

    if (isLoading) return <p>Logging Out...</p>
    if (isError) return <p>Error: {error.data?.message}</p>

    let newNoteButton = null
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <button
                onClick={onNewNoteClicked}
            >
                NewNote
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                onClick={onNewUserClicked}
            >
                NewUser
            </button>
        )
    }

    let userButton = null
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    onClick={onUsersClicked}
                >
                    Users
                </button>
            )
        }
    }

    let notesButton = null
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button
                onClick={onNotesClicked}
            >
                Notes
            </button>
        )
    }

    const logoutButton = (
        <button
            onClick={sendLogout}
        >
            Logout
        </button>
    )

    if(isError) {
        return <p>{error?.data?.message}</p>
    }

    return(
        <header className='dash-header'>
            <Link to='/dash'>
                <h3>Dash header</h3>
            </Link>
            {newNoteButton}
            {newUserButton}
            {notesButton}
            {userButton}
            {logoutButton}
        </header>
    )
}