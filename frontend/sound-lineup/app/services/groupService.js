const API_BASE_URL = 'http://localhost:3001/api/groups/';

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
    const response = await fetch(`${API_BASE_URL}${groupId}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`}
    });
    return handleResponse(response);
}

export async function handleResponse(response){
    if (!response.ok) {
        //const errorData = await response.json();
        throw new Error(`${response.status} ${response.message}`);
    }
    return response.json();
}