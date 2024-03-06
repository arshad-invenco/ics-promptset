import { Dropdown, Modal } from "react-bootstrap";
import "./editLanguage.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Language } from "../../../../models/language.modal";
import { Font } from "../../../../models/fonts.modal";
import { selectFonts } from "../../../../redux/selectors/fontSelectors";
import { getFilteredFonts } from "../../../../constants/fontConstant";
import FontDropdown from "../../../common/font-dropdown/fontDropdown";
import {
  createModalInfo,
  getLangModalViewItems,
  getPromptsetLanguages,
  onPromptLanguageSave,
  setCompanyLanguages,
  setLangModalViewItems,
} from "../../../../constants/language";
import UpdateDefaultFont from "./update-default-font-modal/updateDefaultFont";
import { getBaseUrl } from "../../../../constants/app";
import { getPromptSetId } from "../../../../constants/promptSetConstants";
import request from "../../../../services/interceptor";
import { AppDispatch } from "../../../../redux/store";
import { fetchPromptSet } from "../../../../redux/thunks/promptSetThunk";
import { fetchSoftKeys } from "../../../../redux/thunks/softkeyThunk";
import { fetchLanguages } from "../../../../redux/thunks/languageThunk";

interface EditLanguageModalProps {
  hide: () => void;
}

function EditLanguageModal({ hide }: EditLanguageModalProps) {
  const fonts: Font[] = useSelector(selectFonts);
  const defaultLanguageId = getPromptsetLanguages().find(
    (lang) => lang.promptSetLanguageSupport.default
  )?.languageSupportId;

  const filteredFonts = getFilteredFonts();
  const [languages, setLanguages] = useState<Language[]>(
    getLangModalViewItems()
  );

  const dispatch = useDispatch<AppDispatch>();

  const defaultLanguage = languages.find(
    (lang) => lang.languageSupportId === defaultLanguageId
  );

  const [selectedDefaultLanguage, setSelectedDefaultLanguage] =
    useState<Language>(defaultLanguage ?? ({} as Language));

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (selectedDefaultLanguage) {
      const defaultLanguage = languages.find(
        (lang) =>
          lang.languageSupportId === selectedDefaultLanguage.languageSupportId
      );
      if (defaultLanguage) {
        defaultLanguage.default = true;
      }
    }
  }, [selectedDefaultLanguage]);

  const [modifiedLanguages, setModifiedLanguages] = useState<Language[]>([]);

  const [showUpdateFontModal, setShowUpdateFontModal] = useState(false);

  const handleUpdateFontModalClose = () => {
    setShowUpdateFontModal(false);
  };

  const handleUpdate = async () => {
    try {
      const response = await request().put(
        `${getBaseUrl()}/media/promptsets/${getPromptSetId()}/languages`,
        modifiedLanguages
      );
      if (response) {
        dispatch(fetchPromptSet(getPromptSetId()));
        dispatch(fetchSoftKeys());
        dispatch(fetchLanguages());
        setCompanyLanguages(response.data);
      }
      hide();
    } catch (error) {}
  };

  function handleFontSelection(item: Font, language: Language) {
    const index = languages.findIndex(
      (lang) => lang.languageSupportId === language.languageSupportId
    );
    if (index !== -1) {
      const updatedLanguages = [...languages];
      updatedLanguages[index].type = item;
      setLanguages(updatedLanguages);
    }
  }

  function handleInputSelection(language: Language) {
    const isChecked = language?.isAvailableInPromptSet || false;
    const index = languages.findIndex(
      (lang) => lang.languageSupportId === language.languageSupportId
    );

    if (index !== -1) {
      const updatedLanguages = [...languages];
      const isDefault =
        language.languageSupportId ===
        selectedDefaultLanguage.languageSupportId;

      updatedLanguages[index].isAvailableInPromptSet = !isChecked;
      updatedLanguages[index].deleted = isChecked;

      if (isDefault) {
        setSelectedDefaultLanguage({
          ...selectedDefaultLanguage,
          deleted: isChecked,
        });
      }

      setLanguages(updatedLanguages);
    }
  }

  function handlePromptLanguageSave() {
    const { languages: newModifiedLanguages, modified: isModified } =
      onPromptLanguageSave(selectedDefaultLanguage);

    setModifiedLanguages(newModifiedLanguages);
    setIsModified(isModified);
  }

  useEffect(() => {
    if (modifiedLanguages.length > 0) {
      const timeoutId = setTimeout(() => {
        if (isModified) {
          confirmAndPutPromptLanguages();
        } else {
          handleUpdate();
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [modifiedLanguages]);

  function confirmAndPutPromptLanguages() {
    setShowUpdateFontModal(true);
  }

  useEffect(() => {
    if (selectedDefaultLanguage) {
      setLanguages(
        languages.map((lang) => {
          if (
            lang.languageSupportId === selectedDefaultLanguage.languageSupportId
          ) {
            lang.default = true;
          } else {
            lang.default = false;
          }
          return lang;
        })
      );
    }
  }, [selectedDefaultLanguage]);

  return (
    <div className="edit-language">
      <Modal.Header>
        <h4>Prompt set languages</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="fonts">
          <label>Languages and default fonts</label>
          {languages.map((language, index) => {
            return (
              <div key={language.languageSupportId} className="row">
                <div className="col-md-1" style={{ paddingTop: "1.2rem" }}>
                  <span className="checkbox-wrap">
                    <input
                      className="check-input"
                      style={{ cursor: "pointer" }}
                      type="checkbox"
                      onChange={() => handleInputSelection(language)}
                      checked={language.isAvailableInPromptSet}
                    />
                  </span>
                </div>
                <div
                  className={
                    language.isAvailableInPromptSet
                      ? "col-md-3 "
                      : "text-grey col-md-3"
                  }
                  style={{ paddingTop: "0.7rem" }}
                  onClick={() => handleInputSelection(language)}
                >
                  {language.language}
                </div>
                <div
                  className={
                    language.deleted ? "col-md-6 no-selection" : "col-md-6"
                  }
                >
                  <div className={language.deleted ? "disabled-option" : ""}>
                    <FontDropdown
                      fonts={filteredFonts}
                      onSelect={(item: Font) =>
                        handleFontSelection(item, language)
                      }
                      selectedFont={language.type || fonts[0]}
                    ></FontDropdown>
                  </div>
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    value={language.size}
                    className="ics-input"
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      if (!isNaN(newSize)) {
                        const updatedLanguages = [...languages];
                        updatedLanguages[index].size = newSize;
                        setLanguages(updatedLanguages);
                      }
                    }}
                    min="1"
                    max="380"
                    disabled={language.deleted}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="default-language col-md-6 ">
          <label>Default language</label>
          <div className="font-dropdown">
            <Dropdown>
              <Dropdown.Toggle className="font-selected">
                {selectedDefaultLanguage?.language ?? "Select default language"}
              </Dropdown.Toggle>

              {fonts.length > 0 && (
                <Dropdown.Menu>
                  <div className="font-menu">
                    {languages
                      .filter((language) => language.isAvailableInPromptSet)
                      .map((language) => (
                        <Dropdown.Item
                          key={language.languageSupportId}
                          onClick={() => {
                            setSelectedDefaultLanguage(language);
                          }}
                          className={
                            language.languageSupportId ===
                            selectedDefaultLanguage?.languageSupportId
                              ? "selected-font"
                              : ""
                          }
                        >
                          <div className="media">
                            <h4 className="media-heading">
                              {language.language}
                            </h4>
                          </div>
                        </Dropdown.Item>
                      ))}
                  </div>
                </Dropdown.Menu>
              )}
            </Dropdown>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-default"
          onClick={(e) => {
            e.stopPropagation();
            hide();
          }}
        >
          Cancel
        </button>
        <div className={selectedDefaultLanguage.deleted ? "no-selection" : ""}>
          <button
            disabled={selectedDefaultLanguage.deleted}
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              handlePromptLanguageSave();
            }}
          >
            SAVE
          </button>
        </div>
      </Modal.Footer>
      <Modal
        show={showUpdateFontModal}
        onHide={handleUpdateFontModalClose}
        size="sm"
      >
        <UpdateDefaultFont
          onHide={handleUpdateFontModalClose}
          onUpdateDefaultFont={() => handleUpdate()}
        />
      </Modal>
    </div>
  );
}

export default EditLanguageModal;
