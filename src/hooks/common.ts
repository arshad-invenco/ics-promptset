
export function openDayPartModal(){
    
}

export function showAssetsDropdown(){

}

export function formatTime(time: number|string) {
    const date = new Date(time);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return hours12 + ':' + minutesStr + ampm;
}
