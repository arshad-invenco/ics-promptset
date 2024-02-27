interface User {
    id: string;
    name: string;
    email: string;
}
interface ClonedFrom {
    id: string;
    name: string;
}
interface Attribs {
    "cless-msg-draw": boolean;
    "cless-event-msg": boolean;
}
interface Template {
    id: string;
    name: string;
}
interface SoftKeys {
    fontColor: string,
    fontSize: 0,
    keycode: string,
    label: string,
    softkey: 0
}
interface TouchMapAreas{
    coords: string,
    id: string,
    shape: string | 'circle',
    softkeyId: string,
    softkeyName: string,
    type: string
}
export interface Lang {
    [key: string]: {
        languageSupportId: string,
        language: string,
        isoCode: string,
        promptSetLanguageSupport: {
            type: string,
            size: number,
            default: boolean,
            deleted: boolean
        }
    }
}
export interface TouchMap {
    id: string,
    areas: TouchMapAreas[]
}
export interface DayPart {
    id: string;
    end: number;
    name: string;
    start: number;
    active: boolean;
    company: string;
}
export interface PromptSetInterface {
    id: string;
    name: string;
    version: string;
    secureFingerprint: string; //null data, but string from swagger
    nonSecureFingerprint: string;  //null data, but string from swagger
    created: string;
    company: string;
    modified: string;
    status: string;
    bg: string;
    deviceType: string;
    screenHeight: number;
    screenWidth: number;
    softwareId: null | string;   //null data & no doc in swagger
    createdBy: User;
    modifiedBy: User;
    template: Template;
    promptTemplateId: string;
    fontColor: string;    //from swagger
    firstApprover: null | string;    //null data & no doc in swagger
    firstApprovedTime: null | string;   //null data & no doc in swagger
    secondApprover: null | string;   //null data & no doc in swagger
    secondApprovedTime: null | string;   //null data & no doc in swagger
    isApprover: boolean;
    clonedFrom: ClonedFrom;
    root: null | string;   //null data & no doc in swagger
    lang: Lang;
    states: State[];
}

export interface State {
    id: string;
    code: string;
    description: string;
    secure: boolean;
    sequence: string;
    attribs: Attribs;
    numericInput: boolean;
    softKeys: boolean;
    dynamicText: boolean;
    promptType: string;
    transactionState: null;   //null data & null in swagger
    assignments : Assignment[];
}

export interface Assignment {
    id: string;
    code: string;
    elements: Elements[];
    dayPart : DayPart;
    promptState: string;
    transactionState: string;  //null data, but string after seeing new data
    contactless: boolean;
    thumbnailUrl: string;    //null data but string in swagger
    promptSetLanguageId: string;    //null data & no doc in swagger
    touchmap: TouchMap;
    softkeys: SoftKeys[];   //[] data but doc in swagger
    type: string;
    parentId: string;
}

export interface Elements {
    id: string;
    type: string;
    value: string;
    top?: number;
    face?: string;
    left?: number;
    size?: number;
    color?: string;
    width?: number;
    height?: number;
    textAlign?: string;
    lock?: boolean;
    userclass?:string
}