const API_BASE_URL = 'http://localhost:3001/api/locals';

export async function getLocals(token){
    const response = await fetch(API_BASE_URL,{
        method: 'GET',
        headers: {'content-type': 'application/json',
        'Authorization': `Bearer ${token}`},
    });
    return handleResponse(response);
}

export async function getLocalById(id,token){
    const response = await fetch(`${API_BASE_URL}/${id}`,{
        method: 'GET',
        headers: {'content-type': 'application/json',
        'Authorization': `Bearer ${token}`}
    })
    return handleResponse(response);
}

export async function handleResponse(response){
    if (!response.ok) {
        throw new Error(`${response.status} ${response.message}`);
    }
    return response.json();
}