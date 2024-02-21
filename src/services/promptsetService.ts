
export default function isSequoiaDevice(deviceType:string) {
    return deviceType.includes('G7-100') || deviceType === 'G6-300' || deviceType === 'G6-400';
}

export function isAssetHaving(elements:any, type:string) {
    return elements.some((element:any) => element.type === type);
}