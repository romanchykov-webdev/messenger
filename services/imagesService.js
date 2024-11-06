import * as FileSystem from 'expo-file-system';
import {decode} from "base64-arraybuffer";
import {supabase} from "../lib/supabase";
import {supabaseUrl} from "../constants";

export const getUserImageSrc = imagePath => {
    if (imagePath) {
        // return {uri: imagePath};
        return getSupabaseFileUrl(imagePath);
    } else {
        return require('../assets/images/defaultUser.png');
    }
}

// https://kjkvvzhtjzgstrnjesdx.supabase.co/storage/v1/object/public/uploads/profiles/1730913112325.png

export const getSupabaseFileUrl = filePath => {
    if (filePath) {
        return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`
    }
    return null
}

//upload media
export const uploadFile = async (folderName, fileUri, isImage = true) => {

    try {

        let fileName = await getFilePath(folderName, isImage);

        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        let imageDate = decode(fileBase64)  //array buffer

        // console.log("Uploading file with name:", fileName);
        // console.log("Uploading file data:", imageDate);
        let {data, error} = await supabase
            .storage
            .from('uploads')
            .upload(fileName, imageDate, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*',
            })

        if (error) {
            console.log('file upload error in try', error);
            return {success: false, msg: "Could not upload media"}
        }

        console.log('data path to file', data)
        return {success: true, data: data.path}

    } catch (error) {
        console.log('file upload error catch', error);
        return {success: false, msg: "Could not upload media"}
    }

}

export const getFilePath = async (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage ? '.png' : 'mp4'}`;
}