import { useEffect, useState } from "react";
import { getArtistById } from "@/app/services/artistService";
import { useParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import EditArtist from "@/app/components/EditArtist";
import Modal from "@/app/components/Modal";
import Link from "next/link";
import { useAuth } from "@/app/AuthContext";
import UploadProfileImage from "@/app/components/UploadProfileImage";
import Image from "next/image";
import styles from "./ArtistProfile.module.css"; // Import the new CSS module

const ArtistProfile = () => {
    const { user, token, userType, login, logout } = useAuth();
    const [artist, setArtist] = useState(user);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleUpdateArtist = (updatedArtist) => {
        setArtist(updatedArtist);
        login(updatedArtist, token, userType);
    };

    if (loading) {
        return <ClipLoader color={"#1db954"} loading={loading} size={50} />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (!artist) {
        return <p>Artist data not available.</p>;
    }

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileHeader}>
                <h1>{artist.name}</h1>
                <p>Age: {artist.age}</p>
            </div>

            <div className={styles.profileContent}>
                <div className={styles.profileSidebar}>
                    {artist.profileImage && (
                        <Image
                            src={`http://localhost:3001/${artist.profileImage}`}
                            alt={artist.name}
                            className={styles.profileImage}
                            width={150}
                            height={150}
                        />
                    )}
                    <h2>{artist.name}</h2>
                    {artist.groupId && (
                        <p>
                            Group:{" "}
                            <Link href={`/groups/${artist.groupId._id}`} className={styles.groupLink}>
                                {artist.groupId.name}
                            </Link>
                        </p>
                    )}
                    <button onClick={() => setEditing(true)} className={styles.editButton}>
                        Edit Profile
                    </button>
                </div>

                <div className={styles.profileDetails}>
                    <div className={styles.sectionTitle}>Opinions</div>
                    <ul>
                        {artist.opinions.map((opinion, index) => (
                            <li key={index} className={styles.opinionItem}>
                                <p>{opinion.opinion}</p>
                                <p>By: {opinion.localName}</p>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.sectionTitle}>Audio Links</div>
                    <ul>
                        {artist.audioLinks.map((link, index) => (
                            <li key={index} className={styles.audioItem}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.platform}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal isOpen={editing} onClose={() => setEditing(false)}>
                <EditArtist artist={artist} onUpdate={handleUpdateArtist} />
            </Modal>

            <div className={styles.uploadImageSection}>
                <UploadProfileImage artistId={artist._id} />
            </div>

            <div className={styles.buttonContainer}>
                <button onClick={() => logout()} className={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ArtistProfile;
