import {Elements, Lang} from "../models/promptset.modal";
import {AssetsDropdownMapping} from "../constants/promptSetConstants";

export default function isSequoiaDevice(deviceType: string) {
    return deviceType.includes('G7-100') || deviceType === 'G6-300' || deviceType === 'G6-400';
}

export function isAssetHaving(elements: Elements[], type: string) {
    return elements.some((element) => element.type === type);
}

export function find(elements: Elements[], type: string) {
    return elements.find((element) => element.type === type);
}


export function getAsset(element: string, type: string) {
    if (type === 'text') {
        return AssetsDropdownMapping[element].text;
    } else if (type === 'icon') {
        return AssetsDropdownMapping[element].icon;
    }
    return AssetsDropdownMapping[element].type;
}


export function getLanguage(languageId: string, lang: Lang) {
    for (let key in lang) {
        if (lang[key].languageSupportId === languageId) {
            return lang[key].isoCode;
        }
    }
    return '';
}

export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result.toString();
}

export function getDateAndTime(time: string) {
    if (!time) return new Date().toLocaleString();
    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
    };
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    formattedDate = formattedDate.replace(/AM|PM/g, match => match.toLowerCase());
    return formattedDate + " (UTC+05:30)";
}

