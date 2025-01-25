import { useAuth } from "@/app/AuthContext";
import { useState } from "react";
import { addAudio } from "@/app/services/artistService";
import styles from "./UploadAudioLink.module.css"; // Import CSS module for styling

const UploadAudioLink = ({ artistId, onAudioLinksUpdate }) => {
    const { token, login, userType } = useAuth();
    const [link, setLink] = useState("");
    const [platform, setPlatform] = useState("");
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!platform || !link) {
            setMessage("Please provide both platform and link.");
            return;
        }

        setIsUploading(true);

        try {
            const result = await addAudio(artistId, platform, link, token);
            setMessage(result.message);
            //onAudioLinksUpdate(result.user);
            login(result.user, token, userType);
            setLink(""); // Reset the form
            setPlatform("");
        } catch (err) {
            setMessage(err.message || "Error uploading audio link.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.uploadWrapper}>
            <h2 className={styles.uploadHeader}>Add Audio Link</h2>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <div className={styles.formField}>
                    <label htmlFor="platform" className={styles.label}>
                        Platform
                    </label>
                    <input
                        type="text"
                        id="platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        placeholder="e.g., Spotify, SoundCloud"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formField}>
                    <label htmlFor="link" className={styles.label}>
                        Audio Link
                    </label>
                    <input
                        type="url"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="e.g., https://spotify.com/track"
                        className={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isUploading}
                >
                    {isUploading ? "Adding..." : "Add Audio Link"}
                </button>
            </form>
            {message && (
                <p
                    className={
                        message.includes("Error")
                            ? styles.errorMessage
                            : styles.successMessage
                    }
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default UploadAudioLink;
