import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

// const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:3500',
//     credentials: 'include',
//     prepareHeaders: (headers, { getState }) => {
//         const tokenObject = getState().auth.token;

//         if (tokenObject && tokenObject.accessToken) {
//             headers.set('authorization', `Bearer ${tokenObject.accessToken}`);
//         }
//         return headers;
//     }
// })

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include', // this way we will always send our cookie containing the refresh token
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        //console.log(getState().auth.token);

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

//baseQueryWithReauth - this is a query wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
    //  console.log('args:', args) // request url, method, body
    //  console.log('api:',api) // signal, dispatch, getState()
    //  console.log('extraOptions:',extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions) //args is the new route

        if (refreshResult?.data) {

            //console.log('refresh result:', refreshResult.data.accessToken)

            // store the new token 
            api.dispatch(setCredentials( refreshResult.data.accessToken ))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    }

    return result
}

// baseQuery - this is appilied to every request we send
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'], // for cached data
    endpoints: builder => ({}) // we add extended slices that we will atach to this apiSlice for notes and for users
})