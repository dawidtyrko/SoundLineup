'use client'
import {getArtists} from '../services/artistService'
import {useEffect, useState} from "react";
import ArtistList from "@/app/components/ArtistList";

export default function ArtistsPage () {
    const [artists, setArtists] = useState([])
    //implement loading
    const [error, setError] = useState(null)

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