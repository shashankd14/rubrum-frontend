
export const getUserToken = () => {
    return `Bearer ${localStorage.getItem('userToken') || ''}`;
}

export default {
    getUserToken
}