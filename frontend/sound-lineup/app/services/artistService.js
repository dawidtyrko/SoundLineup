import {token} from "morgan";

const API_BASE_URL = 'http://localhost:3001/api/artists';
const LOGIN_BASE_URL = 'http://localhost:3001/api';


export async function loginArtist(name, password, userType){
    const response = await fetch(`${LOGIN_BASE_URL}/${userType}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name,
            password: password
        })
    })
    return handleResponse(response)
}
export async function getArtists(token) {
    const response = await fetch(API_BASE_URL,{
        method: 'GET',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    });
    return handleResponse(response);
}

export async function updateArtistById(artistId, updatedData, token) {
    const response = await fetch(`${API_BASE_URL}/${artistId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
    });
    return handleResponse(response);
}

export async function createArtist(artistData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: artistData.name,
            age: artistData.age,
            password: artistData.password
        }),
    });
    return handleResponse(response);
}
export async function uploadProfileImage(artistId, file, token) {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch(`${API_BASE_URL}/upload/${artistId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    return handleResponse(response);
}

export async function addAudio(artistId,platform, link,token) {
    const response = await fetch(`${API_BASE_URL}/${artistId}/add-audio-link`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
            "platform": platform,
            "url": link
        })
    })
    return handleResponse(response);
}

export async function addOpinion(artistId, opinionData) {
    const response = await fetch(`${API_BASE_URL}/${artistId}/opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opinionData),
    });
    return handleResponse(response);
}

export async function getArtistById(id,token) {
    const response = await fetch(`${API_BASE_URL}/${id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`},
    });
    return handleResponse(response);
}

export async function deleteAudioLink(artistId,token,platform){
    const response = await fetch(`${API_BASE_URL}/${artistId}/delete-audio-link`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
            "platform": platform
        })
    })
    return handleResponse(response);
}

export async function deleteProfileImage(artistId,token){
    const response = await fetch(`${API_BASE_URL}/${artistId}/profile-image`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    })
    return handleResponse(response);
}
export async function deleteProfile(artistId,token){
    const response = await fetch(`${API_BASE_URL}/${artistId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    })
    return handleResponse(response);
}
export async function handleResponse(response){
    if (!response.ok) {
        let errorMessage = `${response.status}: An unknown error occurred`;
        try {
            const errorText = await response.text();
            //console.log("Raw error response body:", errorText);

            const errorData = JSON.parse(errorText);
            errorMessage = `${errorData.message || "An unknown error occurred"}`;
        } catch (parseError) {
            console.error("Error parsing JSON from response:", parseError);
            // console.warn(
            //     `Falling back to raw response: "${response.statusText}" (status: ${response.status})`
            // );
            errorMessage = `${response.status}: ${response.statusText || "Unable to parse error response"}`;
        }

        throw new Error(errorMessage);
    }
    return response.json();
}