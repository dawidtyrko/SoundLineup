'use client'
import {useParams, useRouter} from "next/navigation";
import GroupDetails from "@/app/components/GroupDetails";

export default function Group({params}) {
    const router = useRouter();
    const {id} = useParams();
    if (!id) return <p>loading</p>

    return (
        <GroupDetails id={id} />
    )
}