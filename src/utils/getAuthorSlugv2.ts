const getAuthorSlug = () => {
    const location = window.location.hostname.split(".")[0];
    const location2 = window.location.hostname.split(".")[1];

    const url = import.meta.env.VITE_URL;
    
    console.log(location);
    console.log(location2);

    const authorSlug:any = location != url ? location2 !== import.meta.env.VITE_SITE_NAME ? { custom_domain: true, domain1: location, domain2: location2 } : { custom_domain: false, domain1: location, domain2: 'no' } : { custom_domain: false, domain1: 'hrithik', domain2: 'no' };

    return authorSlug;
}

export default getAuthorSlug;