'use client'


import {useAuth} from "@/app/AuthContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getLocals} from "@/app/services/localService";
import ClipLoader from "react-spinners/ClipLoader";
import LocalList from "@/app/components/LocalList";

export default function LocalsPage(){
    const {user, token}=useAuth()
    const [locals, setLocals] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const router = useRouter();

    useEffect(() => {
        if(user){
            console.log(user)
        }
    },[user])

    useEffect(() => {
        async function fetchLocals(){
            try{
                const data = await getLocals();
                setLocals(data.locals)
                setLoading(false)
            }catch(err){
                setError(err)
                setLoading(false)
            }
        }
        fetchLocals()
    },[])
    console.log(locals)

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }
    return (
        <LocalList locals={locals}/>
    )
}