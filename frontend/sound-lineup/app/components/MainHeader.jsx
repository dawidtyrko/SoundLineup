'use client'
import Link from "next/link";
import classes from "./MainHeader.module.css";
import {useAuth} from "@/app/AuthContext";
import NavLink from "@/app/components/NavLink";

export default function MainHeader() {
    return (
        <>
            <header className={classes.header}>
                <Link className={classes.logo} href='/'>
                    {/*<Image  src={logoImg} priority alt='logo'/>*/}
                    Sound Lineup
                </Link>

                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <NavLink href="/artists">Browse Artists</NavLink>
                        </li>
                        <li>
                            <NavLink href="/groups">Browse Groups</NavLink>
                        </li>
                        <li>
                            <NavLink href="/locals">Browse Locals</NavLink>
                        </li>
                        <li>
                            <NavLink href="/offers">Browse Offers</NavLink>
                        </li>
                        <li>
                            <NavLink href="/profile">My Profile</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}