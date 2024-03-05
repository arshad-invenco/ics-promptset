import Dropdown from "react-bootstrap/Dropdown";
import { Font } from "../../../models/fonts.modal";
import "./fontDropdown.scss";

interface FontDropdownProps {
  fonts: Font[];
  selectedFont: Font;
  onSelect: (item: Font) => void;
}

function FontDropdown({ fonts, selectedFont, onSelect }: FontDropdownProps) {
  // Group fonts by type
  const groupedFonts: { [key: string]: Font[] } = fonts.reduce(
    (groups: { [key: string]: Font[] }, font) => {
      const key = font.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(font);
      return groups;
    },
    {}
  );

  return (
    <div className="font-dropdown">
      <Dropdown>
        <Dropdown.Toggle className="font-selected">
          {selectedFont && selectedFont.name ? (
            <span className="selected-font-name">
              {selectedFont.name}
              {selectedFont.assetName && (
                <span>
                  {" | "}
                  {selectedFont.assetName}
                </span>
              )}
            </span>
          ) : (
            "Font"
          )}
        </Dropdown.Toggle>

        {fonts.length > 0 && (
          <Dropdown.Menu>
            {Object.entries(groupedFonts).map(([type, fonts]) => (
              <div key={type} className="font-menu">
                <div className="group-type">{type}</div>
                {fonts.map((font) => (
                  <Dropdown.Item
                    key={font.fontId}
                    onClick={() => onSelect(font)}
                    style={{ fontFamily: font?.fontId }}
                    className={
                      font && font?.name === selectedFont?.name
                        ? "selected-font"
                        : ""
                    }
                  >
                    <div className="media">
                      <h4 className="media-heading">
                        {font?.name}
                        {font?.assetName && (
                          <span className="font-asset-name font-family-base">
                            {font?.assetName}
                          </span>
                        )}
                      </h4>
                    </div>
                  </Dropdown.Item>
                ))}
              </div>
            ))}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
}

export default FontDropdown;
