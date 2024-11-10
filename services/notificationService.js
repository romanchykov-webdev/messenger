import {supabase} from "../lib/supabase";

//fetch notification
export const createNotification = async (notification) => {

    try {

        const {data, error} = await supabase
            .from('notifications')
            .insert(notification)
            .select()
            .single()

        if (error) {
            console.log('Notification error', error);
            return {success: false, msg: 'Something went wrong'};
        }

        return {success: true, data: data}


    } catch (error) {
        console.log('Post like error', error);
        return {success: false, msg: 'Something went wrong'};
    }

}

//fetch notification
export const fetchNotifications = async (receiverId) => {

    try {

        const {data, error} = await supabase
            .from('notifications')
            .select(`
                *,
                sender:senderId(id,name,image)
            `)
            .eq('receiverId', receiverId)
            .order('created_at', {ascending: false})

        if (error) {
            console.log('Fetch notification  error', error);
            return {success: false, msg: 'Could not fetch notification'};
        }

        return {success: true, data: data}


    } catch (error) {
        console.log('Fetch notification error', error);
        return {success: false, msg: 'Could not fetch notification'};
    }

}