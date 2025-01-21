'use client'


import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getLocalById} from "@/app/services/localService";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";

const ArtistDetails = ({id}) => {

    const [local, setLocal] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if(!id) return
        async function fetchLocal(){
            try{
                const data = await getLocalById(id)
                setLocal(data.local)
            }catch(err){

            }finally {
                setLoading(false)
            }
        }
    },[id])

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    if(!local){
        return <p>Local data not available.</p>
    }

    const averageRating = local.ratings.length > 0
        ? (local.ratings.reduce((sum, rating) => sum + rating.rating, 0) / local.ratings.length).toFixed(1)
        : "No ratings yet";

    return (
        <div>
            <h1>{local.name}</h1>
            {local.profileImage && (
                <Image src={`http://localhost:3001/${local.profileImage}`} alt={local.name} className="circular-image"
                       width={150} height={150}/>)}

            <h2>Ratings</h2>
            <p>Average Rating: {averageRating}</p>

            <h2>Opinions</h2>
            <ul>
                {local.opinions.map((opinion, index) => (
                    <li key={index}>
                        <p>{opinion.opinion}</p>
                        <p>By: {opinion.localName}</p>
                    </li>
                ))}
            </ul>

            <h2>Address</h2>
            TODO
        </div>
    )
}