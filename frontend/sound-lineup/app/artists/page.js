'use client'
import {getArtists} from '../services/artistService'
import {useEffect, useRef, useState} from "react";
import ArtistList from "@/app/components/ArtistList";
import {useAuth} from "@/app/AuthContext";

import ClipLoader from "react-spinners/ClipLoader";
import './artistList.css'
export default function ArtistsPage () {
    const {user,token,restoreSession} = useAuth()
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredArtists, setFilteredArtists] = useState([])
    const [isSessionRestored, setIsSessionRestored] = useState(false)

    const [error, setError] = useState(null)
    //new------------
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const lastViewedArtist = useRef(null);

    useEffect(() => {
        const restore = async () => {
            await restoreSession()
            setIsSessionRestored(true)
        }
        restore()
    },[restoreSession])

    useEffect(() => {
        if(!isSessionRestored || !token){
            return;
        }
        async function fetchArtists () {
            try{
                const data = await getArtists(token)
                setArtists(data.artists)
                setLoading(false)
            }catch(err){
                setError(err)
                setLoading(false)
            }
        }
        fetchArtists()
    },[isSessionRestored,token])

    useEffect(() => {

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = artists.filter(artist =>
            artist.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredArtists(filtered);
    }, [searchQuery, artists]);

    //pagination logic
    const indexOfLastArtist = currentPage * itemsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - itemsPerPage;
    const currentArtists = filteredArtists.slice(indexOfFirstArtist, indexOfLastArtist);

    const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleArtistClick = (artistId) => {
        lastViewedArtist.current = artistId;
        console.log(lastViewedArtist.current);
    };

    if(!user || !isSessionRestored || loading){
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
            <ArtistList artists={currentArtists} onArtistClick={handleArtistClick}/>
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}