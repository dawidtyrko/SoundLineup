'use client'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/AuthContext";
import {getGroups} from "@/app/services/groupService";
import GroupList from "@/app/components/GroupList";
import ClipLoader from "react-spinners/ClipLoader";
import '../artists/artistList.css'
export default function GroupsPage() {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState([]);

    const router = useRouter();
    const {user, token} = useAuth()
    //implement loading
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user){
            router.push('/login')
        }
    },[user])

    useEffect(() => {
        async function fetchGroups () {
            try{
                const data = await getGroups(token);
                setGroups(data.groups)
                setLoading(false)
            }catch(err){
                setError(err)
                setLoading(false)
            }
        }
        fetchGroups()
    },[])

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = groups.filter(group =>
            group.name.toLowerCase().includes(lowerCaseQuery)
        )
        setFilteredGroups(filtered);
    },[searchQuery,groups])

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"/>
            <GroupList groups={filteredGroups}/>
        </div>
    )
}