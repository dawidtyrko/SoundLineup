'use client'
import Link from "next/link";
import classes from "./MainHeader.module.css";
import {useAuth} from "@/app/AuthContext";
import NavLink from "@/app/components/NavLink";
import {usePathname} from "next/navigation";

export default function MainHeader() {
    const pathname = usePathname()
    const isLoginPage = pathname.startsWith("/login");
    return (
        <>
            <header className={classes.header}>
                <Link className={classes.logo} href='/'>
                    Sound Lineup
                </Link>

                {/* Conditionally hide the navigation if on the login page */}
                {!isLoginPage && (
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
                )}
            </header>
        </>
    );
}