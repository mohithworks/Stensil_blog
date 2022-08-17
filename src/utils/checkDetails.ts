import supabaseClient from './supabaseClient';

const checkDetails = async (user: string, type: string, query: string) => {
    const { data, error } = await supabaseClient
        .from('authors')
        .select(query)
        .eq(type, user)
        .single();

    if(error) return error;
    else return data;
}

export default checkDetails;