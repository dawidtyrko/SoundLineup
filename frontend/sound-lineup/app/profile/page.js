'use client'
import {useAuth} from "@/app/AuthContext";
import ArtistProfile from "@/app/components/ArtistProfile";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import GroupProfile from "@/app/components/GroupProfile";

export default function Page() {
    const {user} = useAuth();
    const router = useRouter();
    const [userType, setUserType] = useState(localStorage.getItem("userType"));
    console.log("profile page", user)
    // useEffect(() => {
    //     if (!user){
    //         router.push('/login')
    //     }
    // },[user,router])
    if (userType === 'artists'){
        return (
            <>
                <ArtistProfile/>
            </>
        )
    }

    if (userType === 'groups'){
        return (
            <>
                <GroupProfile/>
            </>
        )
    }

}