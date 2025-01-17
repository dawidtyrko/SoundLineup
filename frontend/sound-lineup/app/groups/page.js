import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/AuthContext";

export default function GroupsPage() {
    const [groups, setGroups] = useState([])
    const router = useRouter();
    const {user} = useAuth()
    //implement loading
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user){
            router.push('/login')
        }
    },[user,router])


}