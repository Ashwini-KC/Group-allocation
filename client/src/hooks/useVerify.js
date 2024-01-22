import axios from "axios"
import { useEffect, useState } from "react"

const useVerify = () => {
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get("http://localhost:4000/token/verify", {headers: {
            "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        }})
            .then(res => res.data)
                .then(data => setRole(data.role))
                    .catch(e => setError(e))
    }, [])
    return { role, error }
}

export default useVerify