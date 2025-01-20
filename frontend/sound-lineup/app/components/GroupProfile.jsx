'use client'
import ClipLoader from 'react-spinners/ClipLoader'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/Modal";
import EditArtist from "@/app/components/EditArtist";
import Image from "next/image"
import EditGroup from "@/app/components/EditGroup";
import Link from "next/link";
import {useAuth} from "@/app/AuthContext";
import AddMemberForm from "@/app/components/AddMemberForm";
const GroupProfile = () =>{
    const {user,token,userType,login, logout} = useAuth()
    const [group,setGroup] = useState(user)
    const [loading, setLoading] = useState(true)
    const [error,setError] = useState(null)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    useEffect(()=>{
        if(user){
            setLoading(false)
            setGroup(user)
        }

    },[user])


    const handleUpdateGroup = (updatedGroup) => {
        setGroup(updatedGroup)
        login(updatedGroup, token,userType);
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
                {group.members.map((member, index) => (
                    <li key={index}>
                        <Link href={`/artists/${member._id}`}>{member.name}</Link>
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
            <button onClick={() => logout()}>Logout</button>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
            <Modal isOpen={editing} onClose={() => setEditing(false)}>
                <EditGroup group={group} onUpdate={handleUpdateGroup}/>
            </Modal>
            <AddMemberForm groupId={group._id} />
        </div>
    );

}
export default GroupProfile;