import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'

export default function NewUserForm() {

    const navigate = useNavigate()

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(["Employee"]) // employee by default

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users') // back to the users list
        }
    }, [isSuccess, navigate]) // we'll get a warning if we do not include navigate in the dependecies array

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length].every(Boolean) && !isLoading
    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    return (
        <div>
            <h1>New user</h1>
            <form onSubmit={onSaveUserClicked}>
            <label>
                Username:
                <input 
                    type = 'text'
                    placeholder = 'username'
                    onChange = {onUsernameChanged}
                    value = {username}
                />
            </label>
            <br />
            <label>
                Password:
                <input 
                    type = 'password'
                    placeholder = 'password'
                    onChange = {onPasswordChanged}
                    value = {password}
                />
            </label>
            <br />
            <label>
                Role:
                <select
                        value={roles}
                        onChange={onRolesChanged}
                    >
                        {options}
                </select>
            </label>
            <br />
            <button>Save</button>

            </form>
        </div>
    )
}