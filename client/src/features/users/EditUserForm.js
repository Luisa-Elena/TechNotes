import React from 'react'
import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from "../../config/roles"

export default function EditUser( {user} ) {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }
    const onActiveChanged = () => setActive(prev => !prev)
    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }
    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let errorMessage = null
    if(isDelError) {
        errorMessage = <p>Cannot delete - {delerror?.data?.message}</p>
    }

    return (
        <div>
            <h1>Update user</h1>

            <form onSubmit={ e => e.preventDefault()}>
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
                empty = no change
            </label>
            <br />
            <label>
                Role:
                <select
                        value={roles}
                        multiple={true}
                        onChange={onRolesChanged}
                    >
                        {options}
                </select>
            </label>
            <br />
            <label>
                <input
                    type='checkbox'
                    checked={active}
                    onChange={onActiveChanged}
                />
                active
            </label>
            <br />
            <button onClick={onSaveUserClicked}>Update</button>
            <button onClick={onDeleteUserClicked}>Delete</button>
            <br />
            {errorMessage}
            </form>
        </div>
    )
}