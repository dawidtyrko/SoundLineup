'use client'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/AuthContext";
import {getGroups} from "@/app/services/groupService";
import GroupList from "@/app/components/GroupList";
export default function GroupsPage() {
    const [groups, setGroups] = useState([])
    const router = useRouter();
    const {user, token} = useAuth()
    //implement loading
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user){
            router.push('/login')
        }
    },[user,router])

    useEffect(() => {
        async function fetchGroups () {
            try{
                const data = await getGroups(token);
                setGroups(data.groups)
            }catch(err){
                setError(err)
            }
        }
        fetchGroups()
    },[])

    return (
        <GroupList groups={groups}/>
    )
}