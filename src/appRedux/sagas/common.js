
export const getUserToken = () => {
    return `Bearer ${localStorage.getItem('userToken') || ''}`;
}

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken') || '';
}

export const getUserId = () => {
    return localStorage.getItem('userName') || '';
}

export const getUserName = () => {
    return localStorage.getItem('userName') || '';
}
export default {
    getUserToken,
    getUserId,
    getUserName
}