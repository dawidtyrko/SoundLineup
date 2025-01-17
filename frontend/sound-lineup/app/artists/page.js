'use client'
import {getArtists} from '../services/artistService'
import {useEffect, useState} from "react";
import ArtistList from "@/app/components/ArtistList";
import {useAuth} from "@/app/AuthContext";
import {useRouter} from "next/navigation";

export default function ArtistsPage () {
    const [artists, setArtists] = useState([])
    const router = useRouter();
    const {user} = useAuth()
    //implement loading
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user){
            router.push('/login')
        }
    },[user,router])

    useEffect(() => {
        async function fetchArtists () {
            try{
                const data = await getArtists()
                setArtists(data.artists)
            }catch(err){
                setError(err)
            }
        }
        fetchArtists()
    },[])

    return (
        <ArtistList artists={artists}/>
    );
}