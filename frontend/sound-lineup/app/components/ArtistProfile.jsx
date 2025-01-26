import { useEffect, useState } from "react";
import {deleteAudioLink, deleteProfile, deleteProfileImage, getArtistById} from "@/app/services/artistService";
import { useParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import EditArtist from "@/app/components/EditArtist";
import Modal from "@/app/components/Modal";
import Link from "next/link";
import { useAuth } from "@/app/AuthContext";
import UploadProfileImage from "@/app/components/UploadProfileImage";
import Image from "next/image";
import styles from "./ArtistProfile.module.css";
import UploadAudioLink from "@/app/components/UploadAudioLink";


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

    const handleDeleteAudioLink = async (platform) => {
        if (!confirm(`Are you sure you want to delete the audio link for ${platform}?`)) {
            return;
        }

        try {
            const result = await deleteAudioLink(artist._id, token, platform);
            setArtist(result.user);
            login(result.user, token, userType);
        } catch (err) {
            console.error("Error deleting audio link:", err);
            setError(err.message || "Failed to delete audio link.");
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);

        try {
            // Step 1: Delete Profile Image (if it exists)
            if (artist.profileImage) {
                try {
                    const result = await deleteProfileImage(artist._id, token);
                    setArtist(result.user); // Update artist state after image deletion
                    login(result.user, token, userType); // Update context if needed
                } catch (error) {
                    console.error("Error deleting profile image:", error);
                    alert("Failed to delete profile image. Please try again.");
                    return; // Stop further deletion if image deletion fails
                }
            }

            // Step 2: Delete Account
            await deleteProfile(user._id, token); // Call the deleteProfile function with artistId and token
            logout(); // Log the user out after successful account deletion
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("There was an error deleting your account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfileImage = async () => {
        if (!confirm("Are you sure you want to delete your profile image?")) {
            return;
        }

        try {
            const result = await deleteProfileImage(artist._id, token);
            setArtist(result.user);
            login(result.user, token, userType); // Update the auth context
        } catch (err) {
            console.error("Error deleting profile image:", err);
            setError(err.message || "Failed to delete profile image.");
        }
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
                    {artist.profileImage ? (
                        <div className={styles.profileImageContainer}>
                            <Image
                                src={`http://localhost:3001/${artist.profileImage}`}
                                alt={artist.name}
                                className={styles.profileImage}
                                width={150}
                                height={150}
                            />
                            <button
                                className={styles.deleteProfileImageButton}
                                onClick={handleDeleteProfileImage}
                            >
                                ✖
                            </button>
                        </div>
                    ) : (
                        <p>No profile image uploaded.</p>
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
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteAudioLink(link.platform)}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal isOpen={editing} onClose={() => setEditing(false)}>
                <EditArtist artist={artist} onUpdate={handleUpdateArtist}/>
            </Modal>

            <div className={styles.uploadContainer}>
                <div className={styles.uploadItem}>
                    <UploadProfileImage artistId={artist._id}
                                        onProfileImageUpdate={handleUpdateArtist}/>
                </div>
                <div className={styles.uploadItem}>
                    <UploadAudioLink artistId={artist._id}
                                     onAudioLinksUpdate={handleUpdateArtist}
                    />
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button onClick={() => logout()} className={styles.logoutButton}>
                    Logout
                </button>
            </div>
            <div className={styles.deleteAccountSection}>
                <button
                    onClick={handleDeleteAccount}
                    className={styles.deleteAccountButton}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
};

export default ArtistProfile;
