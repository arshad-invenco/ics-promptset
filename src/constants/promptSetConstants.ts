export const AssetsDropdownMapping : {[key:string] : {icon:string, text:string}} = {
    'bg'  : {
        icon : 'far fa-square',
        text : 'Background'
    },
    'text': {
        icon : 'fas fa-font',
        text : 'Text'
    },
    'input': {
        icon : 'fas fa-i-cursor',
        text : 'Input'
    },
    'image': {
        icon : 'far fa-image',
        text : 'Image'
    },
    'video': {
        icon : 'fas fa-video',
        text : 'Video'
    },
    'touchmask': {
        icon : 'far fa-hand-pointer',
        text : 'Touch Mask'
    },
    'area': {
        icon : 'fas fa-square',
        text : 'Touch Area'
    }
}

export const TEXT = 'text';
export const INPUT = 'input';
export const BG = 'bg';
export const IMAGE = 'image';
export const TOUCH_MASK = 'touchmask';
export const AREA = 'area';
export const VIDEO = 'video';

export const ICON = 'icon';
export const STATE = 'state';
export const CHILD_STATE = 'child_state';
export const EXCEPTION = 'exception';

export const ELEMENTS_LIST = [BG, TEXT, IMAGE, VIDEO, INPUT, TOUCH_MASK, AREA ]