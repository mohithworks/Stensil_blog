const getAuthorSlug = () => {
    const location = window.location.hostname.split(".")[0];
    const location2 = window.location.hostname.split(".")[1];
    const location3 = window.location.hostname;
    const url = import.meta.env.VITE_URL;
    
    console.log(location);
    console.log(location2);
    console.log(location3);
    const authorSlug = location != url ? location == 'stensil-blog' ? 'hrithik' : location : 'hrithik';

    return authorSlug;
}

export default getAuthorSlug;