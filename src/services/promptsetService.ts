import {Elements, Lang} from "../models/promptset.modal";
import {AssetsDropdownMapping} from "../constants/promptSetConstants";

export default function isSequoiaDevice(deviceType:string) {
    return deviceType.includes('G7-100') || deviceType === 'G6-300' || deviceType === 'G6-400';
}

export function isAssetHaving(elements:Elements[], type:string) {
    return elements.some((element) => element.type === type);
}

export function find(elements:Elements[], type:string) {
    return elements.find((element) => element.type === type);
}


export function getAsset(element:string, type:string){
    if(type === 'text'){
        return AssetsDropdownMapping[element].text;
    } else if(type === 'icon'){
        return AssetsDropdownMapping[element].icon;
    }
    return AssetsDropdownMapping[element].type;
}


export function getLanguage(languageId:string, lang:Lang) {
    for (let key in lang) {
        if (lang[key].languageSupportId === languageId) {
            return lang[key].isoCode;
        }
    }
    return '';
}

