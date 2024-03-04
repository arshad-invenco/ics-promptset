import { Dropdown, Modal } from "react-bootstrap";
import "./editLanguage.scss";
import { useSelector } from "react-redux";
import { selectLanguages } from "../../../../redux/selectors/languageSelectors";
import { useEffect, useState } from "react";
import { Language } from "../../../../models/language.modal";
import { Font } from "../../../../models/fonts.modal";
import { selectFonts } from "../../../../redux/selectors/fontSelectors";
import {
  filterFonts,
  getFilteredFonts,
} from "../../../../constants/fontConstant";
import FontDropdown from "../../../common/font-dropdown/fontDropdown";
import { get } from "http";
import {
  getDefaultLanguage,
  getLangModalViewItems,
  langModalViewItems,
  onPromptLanguageSave,
  setNewDefault,
} from "../../../../constants/language";
import UpdateDefaultFont from "./update-default-font-modal/updateDefaultFont";

interface EditLanguageModalProps {
  hide: () => void;
}

function EditLanguageModal({ hide }: EditLanguageModalProps) {
  const fonts: Font[] = useSelector(selectFonts);

  const filteredFonts = getFilteredFonts();
  const [languages, setLanguages] = useState<Language[]>(
    getLangModalViewItems()
  );
  const [selectedDefaultLanguage, setSelectedDefaultLanguage] =
    useState<Language>(getDefaultLanguage().value);
  const [modifiedLanguages, setModifiedLanguages] = useState<Language[]>([]);

  const [showUpdateFontModal, setShowUpdateFontModal] = useState(false);

  const handleUpdateFontModalClose = () => {
    setShowUpdateFontModal(false);
  };

  function handleUpdate() {}

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
    let isChecked = language?.isAvailableInPromptSet || false;
    const index = languages.findIndex(
      (lang) => lang.languageSupportId === language.languageSupportId
    );
    if (index !== -1) {
      const updatedLanguages = [...languages];
      updatedLanguages[index].isAvailableInPromptSet = !isChecked;
      setLanguages(updatedLanguages);
    }
  }

  function handlePromptLanguageSave() {
    setModifiedLanguages(
      onPromptLanguageSave(languages, selectedDefaultLanguage)
    );
    if (modifiedLanguages.length > 0) {
      confirmAndPutPromptLanguages();
    }
  }

  function confirmAndPutPromptLanguages() {
    setShowUpdateFontModal(true);
  }

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
                      ? "col-md-3"
                      : "text-grey col-md-3"
                  }
                  style={{ paddingTop: "0.7rem" }}
                >
                  {language.language}
                </div>
                <div className="col-md-6">
                  <FontDropdown
                    fonts={filteredFonts}
                    onSelect={(item: Font) =>
                      handleFontSelection(item, language)
                    }
                    selectedFont={language.type || fonts[0]}
                  ></FontDropdown>
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
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            handlePromptLanguageSave();
          }}
        >
          SAVE
        </button>
      </Modal.Footer>
      <Modal
        show={showUpdateFontModal}
        onHide={handleUpdateFontModalClose}
        size="sm"
      >
        <UpdateDefaultFont
          hide={handleUpdateFontModalClose}
          onUpdateDefaultFont={handleUpdate}
        />
      </Modal>
    </div>
  );
}

export default EditLanguageModal;
