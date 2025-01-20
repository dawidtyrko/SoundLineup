'use client';
import { useState } from "react";
import { useAuth } from "@/app/AuthContext";
import { useRouter } from "next/navigation";

const AddMemberForm = ({ groupId }) => {
    const { token, login } = useAuth(); // Get token from context
    const [artistName, setArtistName] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!artistName) {
            setError("Artist name is required");
            return;
        }

        try {
            // Send POST request to add artist to the group
            const response = await fetch('http://localhost:3001/api/groups/add-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    groupId: groupId,
                    artistName: artistName,  // Send artist name instead of artistId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); // Show success message
                setArtistName(''); // Clear input field
               login(data.group, token, "groups")
            } else {
                setError(data.message); // Show error message
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while adding the artist to the group.");
        }
    };

    return (
        <div>
            <h3>Add Member to Group</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Artist Name</label>
                    <input
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Enter artist name"
                    />
                </div>
                <button type="submit">Add Artist</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default AddMemberForm;
