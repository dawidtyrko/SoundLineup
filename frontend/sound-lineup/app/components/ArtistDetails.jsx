'use client'
import {useEffect, useState} from "react";
import {getArtistById} from "@/app/services/artistService";
import ClipLoader from 'react-spinners/ClipLoader'
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";


const ArtistDetails = ({id}) => {

    const [artist, setArtist] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
    // if(artist.groupId != null){
    //     console.log(artist.groupId._id);
    //     console.log(artist.groupId);
    // }
    //console.log(artist.profileImage);

    return (
        <div>
            <h1>{artist.name}</h1>
            <p>Age: {artist.age}</p>
            {/*<p>Rating: </p>*/}
            {artist.groupId && <p>Group: <Link href={`/groups/${artist.groupId._id}`}> {artist.groupId.name}</Link></p>}
            {artist.profileImage && (<Image src={`http://localhost:3001/${artist.profileImage}`} alt={artist.name} className="circular-image" width={150} height={150} />)}
            <h2>Opinions</h2>
            <ul>
                {artist.opinions.map((opinion, index) => (
                    <li key={index}>
                        <p>{opinion.opinion}</p>
                        <p>By: {opinion.localName}</p>
                    </li>
                ))}
            </ul>
            <h1>Audio Links</h1>
            <ul>
                {artist.audioLinks.map((link, index) => (
                    <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.platform}
                        </a>
                    </li>
                ))}
            </ul>

        </div>
    )
}
export default ArtistDetails;