'use client'
import ArtistDetails from "@/app/components/ArtistDetails";
import {useParams, useRouter} from "next/navigation";

export default function ArtistPage({params}) {
    const router = useRouter();
    const {id} = useParams();
    if (!id) return <p>Loading</p>;
    console.log(id)
    return (
        <ArtistDetails id={id} />
    )
}