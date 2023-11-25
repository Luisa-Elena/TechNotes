// we create a custom hook
// this is to make out login persist through refreshing the page
// it's like a use local storage component

import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist