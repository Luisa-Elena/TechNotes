import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({ // username and password
                url: 'auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // onQueryStarted is a RTK query function that we can call inside our endpoint
            // with queryFulfilled we can verify if our query has been fulfilled
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    //const { data } = 
                    await queryFulfilled
                    //console.log(data) //--> our message: 'cookie cleared'
                    dispatch(logOut()) // sets the token to null in our local state
                    setTimeout(() => {
                        // the apiSlice needs to be cleared as well
                        dispatch(apiSlice.util.resetApiState()) // this will clear out the cache and the query subscriptions
                    }, 1000) //1sec -> we must put a little delay, otherwise we will still have a subscription for the lists after logout

                    //dispatch(apiSlice.util.resetApiState()) //without timeout

                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log("authApiSlice - refresh", data)
                    const { accessToken } = data
                    //console.log("authApiSlice - refresh", accessToken)
                    dispatch(setCredentials( accessToken ))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 