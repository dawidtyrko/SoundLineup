'use client'
import { useEffect, useState } from "react";
import { getArtistById } from "@/app/services/artistService";
import ClipLoader from 'react-spinners/ClipLoader';
import Image from "next/image";
import Link from "next/link";
import classes from './ArtistDetails.module.css';  // Import the CSS module for styling

const ArtistDetails = ({ id, token }) => {
    const [artist, setArtist] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !token) return;
        async function fetchArtist() {
            try {
                const data = await getArtistById(id, token);
                setArtist(data.artist);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchArtist();
    }, [id, token]);

    if (loading) {
        return <ClipLoader color={"#123abc"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (!artist) {
        return <p>Artist data not available.</p>;
    }

    const hasRatings = Array.isArray(artist.ratings) && artist.ratings.length > 0;
    const averageRating = hasRatings
        ? (artist.ratings.reduce((sum, rating) => sum + rating.rating, 0) / artist.ratings.length).toFixed(1)
        : "No ratings yet";

    return (
        <div className={classes.profileWrapper}>
            <div className={classes.profileHeader}>
                <h1>{artist.name}</h1>
                <p>Age: {artist.age}</p>
            </div>
            <div className={classes.profileContent}>
                <div className={classes.profileSidebar}>
                    {artist.profileImage && (
                        <Image
                            src={`http://localhost:3001/${artist.profileImage}`}
                            alt={artist.name}
                            className={classes.profileImage}
                            width={150}
                            height={150}
                        />
                    )}
                    {artist.groupId && (
                        <p>Group: <Link href={`/groups/${artist.groupId._id}`}>{artist.groupId.name}</Link></p>
                    )}
                </div>
                <div className={classes.profileDetails}>
                    <section>
                        <h2 className={classes.sectionTitle}>Ratings</h2>
                        <p>Average Rating: {averageRating}</p>
                    </section>

                    <section>
                        <h2 className={classes.sectionTitle}>Opinions</h2>
                        <ul>
                            {artist.opinions.map((opinion, index) => (
                                <li key={index} className={classes.opinionItem}>
                                    <p>{opinion.opinion}</p>
                                    <p>By: {opinion.localName}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className={classes.sectionTitle}>Audio Links</h2>
                        <ul>
                            {artist.audioLinks.map((link, index) => (
                                <li key={index} className={classes.audioItem}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        {link.platform}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ArtistDetails;
