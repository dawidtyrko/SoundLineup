'use client'
import ArtistDetails from "@/app/components/ArtistDetails";
import {useParams} from "next/navigation";
import {useAuth} from "@/app/AuthContext";
import {useEffect, useState} from "react";


export default function ArtistPage() {
    const {restoreSession,token} = useAuth()
    const [isSessionRestored, setIsSessionRestored] = useState(false)
    const {id} = useParams();

    useEffect(() => {
        const restore = async () => {
            await restoreSession()
            setIsSessionRestored(true)
        }
        restore()
    },[restoreSession])

    if(isSessionRestored){
        return (
            <ArtistDetails id={id} token={token} />
        )
    }

}