'use client'
import ClipLoader from 'react-spinners/ClipLoader'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/Modal";
import EditArtist from "@/app/components/EditArtist";

const GroupProfile = ({user}) =>{
    const [group,setGroup] = useState(user)
    const [loading, setLoading] = useState(true)
    const [error,setError] = useState(null)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            setError('No group data available');
            setLoading(false);
            router.push('/')
        }
        setGroup(user);
        setLoading(false);
    }, [user]);

    const handleUpdateGroup = (updatedGroup) => {
        setGroup(updatedGroup)
    }
    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    if(!group) {
        return <p>Artist data not available.</p>
    }

    return (
        <div>
            <h1>{group.name}</h1>
            <h2>Members:</h2>
            <ul>
                {group.members.map((member) => (
                    <li key={member._id}>
                        <p>Name: {member.name}</p>
                        <p>Age: {member.age}</p>
                    </li>
                ))}
            </ul>
            <h2>Opinions</h2>
            <ul>
                {group.opinions.map((opinion, index) => (
                    <li key={index}>
                        <p>{opinion.opinion}</p>
                        <p>By: {opinion.localName}</p>
                    </li>
                ))}
            </ul>
            <h2>Audio Links</h2>
            <ul>
                {group.audioLinks.map((link, index) => (
                    <li key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.platform}
                        </a>
                    </li>
                ))}
            </ul>
            {group.profileImage && (
                <Image src={`http://localhost:3001/${group.profileImage}`} alt={group.name} className='circular-image'
                       width={150} height={150}/>)}
            <button onClick={() => setEditing(true)}>Edit Profile</button>
            <Modal isOpen={editing} onClose={() => setEditing(false)}>
                <EditArtist artist={artist} onUpdate={handleUpdateGroup}/>
            </Modal>
        </div>
    );

}
export default GroupProfile;