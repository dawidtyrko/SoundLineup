'use client'


import {useParams, useRouter} from "next/navigation";

import LocalDetails from "@/app/components/LocalDetails";

export default function LocalPage({params}){
    const router = useRouter();
    const {id} = useParams();
    if(!id) return <p>Loading</p>
    return (
        <LocalDetails id={id} />
    )
}