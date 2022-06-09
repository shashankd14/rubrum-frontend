
export const getUserToken = () => {
    return localStorage.getItem('userToken') || '';
}

export default {
    getUserToken
}