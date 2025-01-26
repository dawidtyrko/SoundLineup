import {token} from "morgan";

const API_BASE_URL = 'http://localhost:3001/api/groups';

export async function addMemberToGroup(groupId, artistId, token) {
    const response = await fetch(`${API_BASE_URL}/add-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, artistId }),
    });
    return handleResponse(response);
}

export async function createGroup(groupData){
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: groupData.name,
            password: groupData.password
        }),
    })
    return handleResponse(response);
}

export async function getGroups(token){
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return handleResponse(response);

}
export async function getGroup(groupId,token){
    const response = await fetch(`${API_BASE_URL}/${groupId}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    });
    return handleResponse(response);
}

export async function updateGroup(groupId, groupData,token){
    const response = await fetch(`${API_BASE_URL}/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData),
    })
    return handleResponse(response);
}

export async function removeMember(groupId,token,artistId){
    const response = await fetch(`${API_BASE_URL}/${groupId}/members/${artistId}`, {
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
            const errorData = JSON.parse(errorText);
            errorMessage = `${errorData.message || "An unknown error occurred"}`;
        } catch (parseError) {
            console.error("Error parsing JSON from response:", parseError);
            errorMessage = `${response.status}: ${response.statusText || "Unable to parse error response"}`;
        }

        throw new Error(errorMessage);
    }
    return response.json();
}