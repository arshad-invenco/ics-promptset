import Dropdown from "react-bootstrap/Dropdown";
import { Font } from "../../../models/fonts";
import "./fontDropdown.scss";

interface FontDropdownProps {
  fonts: Font[];
  selectedFont: string;
  onSelect: (item: string) => void;
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
    <Dropdown>
      <Dropdown.Toggle className="font-selected">
        {selectedFont}
      </Dropdown.Toggle>

      {fonts.length > 0 && (
        <Dropdown.Menu>
          {Object.entries(groupedFonts).map(([type, fonts]) => (
            <div key={type} className="font-menu">
              <div className="group-type">{type}</div>
              {fonts.map((font) => (
                <Dropdown.Item
                  key={font.fontId}
                  onClick={() => onSelect(font.fontId)}
                  style={{ fontFamily: font.fontId }}
                  className={font.name === selectedFont ? "selected-font" : ""}
                >
                  <div className="media">
                    <h4 className="media-heading">
                      {font.name}
                      {font.assetName && (
                        <span className="font-asset-name font-family-base">
                          {font.assetName}
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
  );
}

export default FontDropdown;
