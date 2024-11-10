import {Dimensions} from "react-native";
import moment from "moment";

const {width:deviceWidth, height:deviceHeight}= Dimensions.get("window");

// get width device
export const wp=percentage=>{
    return (percentage*deviceWidth) /100;
}

export const hp=percentage=>{
    return (percentage*deviceHeight) / 100;
}

export const stripHtmlTags=(html)=>{
    return html.replace(/<[^>]*>?/gm,'')
}

export const formatDate = (date) => moment(date).format('D MMM');

export const formatTime = (date) => moment(date).format('HH:mm');