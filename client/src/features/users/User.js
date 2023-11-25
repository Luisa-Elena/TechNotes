import {useNavigate} from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'

const User = ({userId}) => {

    const navigate = useNavigate()
    const user = useSelector(state => selectUserById(state, userId))

    function handleEdit() {
        navigate(`/dash/users/${userId}`)
    }

    let userRolesString
    if(user) {
        userRolesString = user.roles.toString().replaceAll(',', ', ') // replace commas with comma and space
    }

    return (
        user && <div>
            <h2>{ user.username }</h2>
            <p>Roles: { userRolesString }</p>
            <button
                onClick={handleEdit}
            >
                Edit user
            </button>
        </div>
    )
}

export default User

