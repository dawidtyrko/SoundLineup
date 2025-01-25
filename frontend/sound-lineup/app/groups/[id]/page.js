'use client'
import {useParams, useRouter} from "next/navigation";
import GroupDetails from "@/app/components/GroupDetails";
import {useAuth} from "@/app/AuthContext";
import {useEffect, useState} from "react";

export default function Group() {
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
            <GroupDetails id={id} token={token} />
        )
    }

}