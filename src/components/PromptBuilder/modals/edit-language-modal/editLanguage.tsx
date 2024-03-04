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

interface EditLanguageModalProps {
  hide: () => void;
}

function EditLanguageModal({ hide }: EditLanguageModalProps) {
  const languages = useSelector(selectLanguages);
  const fonts: Font[] = useSelector(selectFonts);

  const filteredFonts = getFilteredFonts();
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [selectedFont, setSelectedFont] = useState("Font");
  const [fontSizes, setFontSizes] = useState<number[]>([47]);
  const [selectedDefaultLanguage, setSelectedDefaultLanguage] =
    useState<Language>();

  function handleFontSelection(item: string) {
    if (item !== "Font") {
      setSelectedFont(item);
    }
  }

  function handleInputSelection(e: React.ChangeEvent<HTMLInputElement>) {
    const language = languages.find(
      (language) => language.language === e.target.value
    );
   
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
                      onChange={handleInputSelection}
                    />
                  </span>
                </div>
                <div
                  className={
                    selectedLanguages.includes(language)
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
                    onSelect={handleFontSelection}
                    selectedFont={selectedFont}
                  ></FontDropdown>
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    value={fontSizes[index]}
                    className="ics-input"
                    onChange={(e) => {
                      const newFontSizes = [...fontSizes];
                      newFontSizes[index] = parseInt(e.target.value);
                      setFontSizes(newFontSizes);
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
                    {languages.map((language, index) => (
                      <Dropdown.Item
                        key={language.languageSupportId}
                        onClick={() => setSelectedDefaultLanguage(language)}
                        className={
                          language.languageSupportId ===
                          selectedDefaultLanguage?.languageSupportId
                            ? "selected-font"
                            : ""
                        }
                      >
                        <div className="media">
                          <h4 className="media-heading">{language.language}</h4>
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
            hide();
          }}
        >
          SAVE
        </button>
      </Modal.Footer>
    </div>
  );
}

export default EditLanguageModal;
