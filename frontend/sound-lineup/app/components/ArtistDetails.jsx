'use client'
import {useEffect, useState} from "react";
import {getArtistById} from "@/app/services/artistService";
import {useParams} from "next/navigation";
import ClipLoader from 'react-spinners/ClipLoader'
import {useRouter} from "next/navigation";

const ArtistDetails = ({id}) => {

    const [artist, setArtist] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!id) return
        async function fetchArtists () {
            try{
                const data = await getArtistById(id);
                setArtist(data.artist)
            }catch(err){
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetchArtists()
    },[id])


    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    if(!artist) {
        return <p>Artist data not available.</p>
    }

    return (
        <div>

            <h1>{artist.name}</h1>
            <p>Age: {artist.age}</p>
            {/*<p>Rating: </p>*/}
            {artist.groupId && <p>Group: {artist.groupId.name}</p>}
            <h2>Opinions</h2>
            <ul>
                {artist.opinions.map((opinion, index) => (
                    <li key={index}>
                        <p>{opinion.opinion}</p>
                        <p>By: {opinion.localName}</p>
                    </li>
                ))}
            </ul>
            <h2>Audio Links</h2>
            <ul>
                {artist.audioLinks.map((link, index) => (
                    <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.platform}
                        </a>
                    </li>
                ))}
            </ul>
            {artist.profileImage && <Image src={artist.profileImage} alt={artist.name} fill/>}
        </div>
    )
}
export default ArtistDetails;