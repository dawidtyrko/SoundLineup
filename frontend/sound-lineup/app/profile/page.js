'use client'
import {useAuth} from "@/app/AuthContext";
import ArtistProfile from "@/app/components/ArtistProfile";

export default function Page() {
    const {user, logout} = useAuth();
    return (<>
        <ArtistProfile user={user}/>
        </>
    )
}