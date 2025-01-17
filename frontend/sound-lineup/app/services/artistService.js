const API_BASE_URL = 'http://localhost:3001/api/artists/';
const LOGIN_BASE_URL = 'http://localhost:3001/api';

//general function to log in the user (artist/group/local)
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
export async function getArtists() {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
}

export async function updateArtistById(artistId, updatedData) {
    const response = await fetch(`${API_BASE_URL}${artistId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token-based auth
        },
        body: JSON.stringify(updatedData),
    });
    return handleResponse(response);
}

export async function createArtist(artistData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistData),
    });
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

export async function getArtistById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
}

export async function handleResponse(response){
    if (!response.ok) {
        //const errorData = await response.json();
        throw new Error(`${response.status} ${response.message}`);
    }
    return response.json();
}