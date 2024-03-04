import { Language } from "../models/language.modal";
import isSequoiaDevice from "../services/promptsetService";
import { getDeviceType } from "./deviceType";

let companyId = "";

export function setCompanyId(id: string) {
  companyId = id;
}

export function getCompanyId() {
  return companyId;
}

// function getPromptsetLanguages( promptSet ) {
//   const promptsetLanguages = Object.values( promptSet.lang );
//   if ( vm.companyLanguages.length >= 1 && promptsetLanguages.length === 0 ) {
//     const companyDefault = _.find( vm.companyLanguages, ( item ) => item.default === true );
//     if ( companyDefault ) {
//       vm.promptSet.lang[ companyDefault.isoCode ] = {
//         languageSupportId: companyDefault.languageSupportId,
//         language: companyDefault.language,
//         isoCode: companyDefault.isoCode,
//         promptSetLanguageSupport: {
//           default: companyDefault.default,
//           deleted: companyDefault.deleted
//         }
//       };
//       vm.promptsetLanguages = Object.values( vm.promptSet.lang );
//     }
//   } else {
//     vm.promptsetLanguages = promptsetLanguages;
//   }
//   vm.languageKeysSet = Object.keys( vm.promptSet.lang );
//   vm.defaultFontSettings = getDefaults();
// }
