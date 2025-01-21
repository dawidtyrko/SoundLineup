'use client'
import {getArtists} from '../services/artistService'
import {useEffect, useState} from "react";
import ArtistList from "@/app/components/ArtistList";
import {useAuth} from "@/app/AuthContext";
import {useRouter} from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import './artistList.css'
export default function ArtistsPage () {
    const {user,token} = useAuth()
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredArtists, setFilteredArtists] = useState([])
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

    useEffect(() => {

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = artists.filter(artist =>
            artist.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredArtists(filtered);
    }, [searchQuery, artists]);

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }
    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"/>
        <ArtistList artists={filteredArtists}/>
        </div>
    );
}