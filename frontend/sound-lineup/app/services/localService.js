const API_BASE_URL = 'http://localhost:3001/api/locals';


export async function getLocals(){
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
}



export async function getLocalById(id){
    const response = await fetch(`${API_BASE_URL}/${id}`)
    return handleResponse(response);
}


export async function handleResponse(response){
    if (!response.ok) {
        //const errorData = await response.json();
        throw new Error(`${response.status} ${response.message}`);
    }
    return response.json();
}