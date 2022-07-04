
export const getUserToken = () => {
    return `Bearer ${localStorage.getItem('userToken') || ''}`;
}

export const getUserId = () => {
    return localStorage.getItem('userName') || '';
}

export default {
    getUserToken,
    getUserId
}