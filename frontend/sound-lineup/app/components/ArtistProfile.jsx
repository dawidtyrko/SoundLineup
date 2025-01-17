'use client'
import {useEffect, useState} from "react";
import {getArtistById} from "@/app/services/artistService";
import {useParams} from "next/navigation";
import ClipLoader from 'react-spinners/ClipLoader'
import {useRouter} from "next/navigation";
import EditArtist from "@/app/components/EditArtist";
import Modal from "@/app/components/Modal";
import Link from "next/link";

const ArtistProfile = ({user}) => {

    const [artist, setArtist] = useState(user);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            setError('No artist data available');
            setLoading(false);
            return;
        }
        setArtist(user);
        setLoading(false);
    }, [user]);

    const handleUpdateArtist = (updatedArtist) => {
        setArtist(updatedArtist);
    }
    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    if(!artist) {
        return <p>Artist data not available.</p>
    }

    console.log(artist.groupId);
    return (
        <div>
            <h1>{artist.name}</h1>
            <p>Age: {artist.age}</p>
            {/*<p>Rating: </p>*/}
            {artist.groupId && <p>Group: <Link href={`/groups/${artist.groupId._id}`}> {artist.groupId.name}</Link></p>}
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
            {artist.profileImage && (<Image src={`http://localhost:3001/${artist.profileImage}`} alt={artist.name} className='circular-image' width={150} height={150} />)}
            <button onClick={() => setEditing(true)}>Edit Profile</button>
            <Modal isOpen={editing} onClose={() => setEditing(false)}>
                <EditArtist artist={artist} onUpdate={handleUpdateArtist}/>
            </Modal>
        </div>
    )
}
export default ArtistProfile;