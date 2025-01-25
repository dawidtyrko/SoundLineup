'use client'

import {useAuth} from "@/app/AuthContext";
import {useEffect, useState} from "react";
import {getLocals} from "@/app/services/localService";
import ClipLoader from "react-spinners/ClipLoader";
import LocalList from "@/app/components/LocalList";

export default function LocalsPage(){
    const {user, token, restoreSession}=useAuth()
    const [locals, setLocals] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredLocals, setFilteredLocals] = useState([]);
    const [isSessionRestored, setIsSessionRestored] = useState(false)


    useEffect(() => {
        const restore = async () => {
            await restoreSession()
            setIsSessionRestored(true)
        }
        restore()
    },[restoreSession])

    useEffect(() => {
        if(!isSessionRestored || !token){
            return;
        }
        async function fetchLocals(){
            try{
                const data = await getLocals(token);
                setLocals(data.locals)
                setLoading(false)
            }catch(err){
                setError(err)
                setLoading(false)
            }
        }
        fetchLocals()
    },[isSessionRestored,token])

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = locals.filter(local =>
            local.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredLocals(filtered);
    },[searchQuery,locals])

    if(!user || !isSessionRestored || loading){
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }
    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"/>
            <LocalList locals={filteredLocals}/>
        </div>
    )
}