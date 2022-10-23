const getAuthorSlug = () => {
    const location = window.location.hostname.split(".")[0];
    const url = import.meta.env.VITE_URL;
    
    const authorSlug = location != url ? location == 'stensil-blog' ? 'hrithik' : location : 'hrithik';

    return authorSlug;
}

export default getAuthorSlug;