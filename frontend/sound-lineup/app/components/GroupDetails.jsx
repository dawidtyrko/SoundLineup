'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getGroup} from "@/app/services/groupService";
import {useAuth} from "@/app/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import Image from "next/image";

const GroupDetails = ({id,token}) => {
    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)



    useEffect(() => {
        if (!id || !token) return
        async function fetchGroups() {
            try{
                const data = await getGroup(id,token)
                setGroup(data.group)
            }catch(err){
                setError(err)
            }finally {
                setLoading(false)
            }
        }
        fetchGroups()
    },[id])

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    if(!group) {
        return <p>Group data not available.</p>
    }
    const averageRating = group.ratings.length > 0
        ? (group.ratings.reduce((sum, rating) => sum + rating.rating, 0) / group.ratings.length).toFixed(1)
        : "No ratings yet";

    return (
        <div>
            <h1>{group.name}</h1>
            <h2>Ratings</h2>
            <p>Average Rating: {averageRating}</p>
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
        </div>
    );
}
export default GroupDetails;