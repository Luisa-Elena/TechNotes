import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import User from './User'

export default function UsersList() {

    const {
        data: users, //the data received is renamed as users
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', { //label 'usersList'
        pollingInterval: 60000, //miliseconds = 60sec --> we refetch the data once a minute
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if(isLoading) {
        content = <p>Loading...</p>
        // we can add a spinner component
    }

    if(isError) {
        content = <p>{error?.data?.message}</p>
    }

    if(isSuccess) {
        //console.log(users)
        const {ids} = users // destructuring the ids from the data (renamed users)
        
        content = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null
    }


    return(
        <div>
            <h1>Users list</h1>
            {content}
        </div>
    )
}