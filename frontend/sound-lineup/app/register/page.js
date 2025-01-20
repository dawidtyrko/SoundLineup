'use client'
import {useState} from "react";
import CreateArtist from "@/app/components/CreateArtist";

export default function registerPage() {
    const [userType, setUserType] = useState('artist');
    return(<CreateArtist/>)

}