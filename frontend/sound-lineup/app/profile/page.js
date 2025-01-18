'use client'
import {useAuth} from "@/app/AuthContext";
import ArtistProfile from "@/app/components/ArtistProfile";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import GroupProfile from "@/app/components/GroupProfile";

export default function Page() {
    const {user, logout} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user){
            router.push('/login')
        }
    },[user,router])
    if (user.userType === 'artists'){
        return (
            <>
                <ArtistProfile user={user}/>
            </>
        )
    }

    if (user.userType === 'groups'){
        return (
            <>
                <GroupProfile user={user}/>
            </>
        )
    }

}