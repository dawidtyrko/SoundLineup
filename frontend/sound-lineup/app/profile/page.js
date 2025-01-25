'use client'
import {useAuth} from "@/app/AuthContext";
import ArtistProfile from "@/app/components/ArtistProfile";
import {useEffect} from "react";

import GroupProfile from "@/app/components/GroupProfile";

export default function Page() {
    const {user,userType, restoreSession} = useAuth();

    useEffect(() => {
        restoreSession();
    },[restoreSession])

    if(!user){
        return <p>Loading...</p>
    }

    if (userType === 'artists'){
        return (
            <>
                <ArtistProfile user={user}/>
            </>
        )
    }

    if (userType === 'groups'){
        return (
            <>
                <GroupProfile user={user}/>
            </>
        )
    }

}