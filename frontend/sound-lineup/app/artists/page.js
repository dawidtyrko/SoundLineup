'use client'
import {getArtists} from '../services/artistService'
import {useEffect, useState} from "react";
import ArtistList from "@/app/components/ArtistList";
import {useAuth} from "@/app/AuthContext";
import {useRouter} from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export default function ArtistsPage () {
    const {user,token} = useAuth()
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [artist, setArtist] = useState(user)
    const router = useRouter();

    const [error, setError] = useState(null)

    useEffect(() => {
        if (user) {
            setArtist(user)
        }
    },[user])

    useEffect(() => {
        async function fetchArtists () {
            try{
                const data = await getArtists()
                setArtists(data.artists)
                setLoading(false)
            }catch(err){
                setError(err)
                setLoading(false)
            }
        }
        fetchArtists()
    },[])
    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }
    return (
        <ArtistList artists={artists}/>
    );
}