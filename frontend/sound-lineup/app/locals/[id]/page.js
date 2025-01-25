'use client'


import {useParams, useRouter} from "next/navigation";

import LocalDetails from "@/app/components/LocalDetails";
import {useAuth} from "@/app/AuthContext";
import {useEffect, useState} from "react";

export default function LocalPage(){
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
            <LocalDetails id={id} token={token} />
        )
    }

}