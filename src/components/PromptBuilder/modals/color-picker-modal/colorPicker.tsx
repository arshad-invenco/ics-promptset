import "./colorPicker.scss";
import { ColorResult, PhotoshopPicker } from "react-color";
import GradientIcon from "@mui/icons-material/Gradient";
import RestoreIcon from "@mui/icons-material/Restore";
import { Modal } from "react-bootstrap";
import React, { memo, useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import useColorHistory from "../../../../hooks/useColorHistory";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  hide: () => void;
}

function ColorPickerModal({ value, onChange, hide }: ColorPickerProps) {
  const [color, setColor] = useState(`#${value}`);
  const [inputValue, setInputValue] = useState(color);
  const [selectedTab, setSelectedTab] = useState<string>("spectrum");
  const { addToHistory, getHistory, resetHistory } = useColorHistory();
  const [history, setHistory] = useState<string[]>([]);

  function handleChange(color: ColorResult) {
    setColor(color.hex);
    setInputValue(color.hex);
  }

  useEffect(() => {
    const fetchedHistory = getHistory();
    setHistory(fetchedHistory);
  }, []);

  function handleColorSelection() {
    addToHistory(color);
    const fetchedHistory = getHistory();
    setHistory(fetchedHistory);
    onChange(color);
    hide();
  }

  function getContrastColor(newColor: string) {
    const colorObj = tinycolor(newColor);
    if (colorObj.isValid()) {
      const luminance = colorObj.getLuminance();
      return luminance > 0.5 ? "var(--gray-base)" : "var(--white)";
    } else {
      return "var(--white)";
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value;
    setInputValue(newColor);

    const colorObj = tinycolor(newColor);
    if (colorObj.isValid()) {
      setColor(colorObj.toHexString().toUpperCase());
    }
  }

  const handleBlur = () => {
    const colorObj = tinycolor(inputValue);
    if (colorObj.isValid()) {
      setColor(colorObj.toHexString().toUpperCase());
      setInputValue(colorObj.toHexString().toUpperCase());
    } else {
      setColor("var(--gray-base)");
      setInputValue("var(--gray-base)");
    }
  };

  return (
    <div className="color-picker">
      <Modal.Header
        style={{ backgroundColor: `${color}`, color: getContrastColor(color) }}
      >
        <input
          type="text"
          value={inputValue}
          spellCheck={false}
          onChange={handleInputChange}
          style={{ color: getContrastColor(color) }}
          onBlur={handleBlur}
        />
      </Modal.Header>
      <Modal.Body>
        {selectedTab === "spectrum" && (
          <PhotoshopPicker color={color} onChange={handleChange} />
        )}
        {selectedTab === "history" && (
          <div className="history">
            <div className="color-picker-history-clear">
              <button className="btn btn-link" onClick={resetHistory}>
                CLEAR
              </button>
            </div>
            <div className="color-picker-history">
              {history.map((color, index) => (
                <button
                  key={index}
                  className="btn btn-color-history btn-block"
                  onClick={() => {
                    setColor(color.toString());
                    setInputValue(color.toString());
                  }}
                  style={{ backgroundColor: color.toString() }}
                >
                  <span>{color.toString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="tab-selection">
          <div
            className={
              selectedTab === "spectrum" ? "tab selected" : "tab not-selected"
            }
            onClick={() => setSelectedTab("spectrum")}
          >
            <GradientIcon fontSize="large" />
          </div>
          <div
            className={
              selectedTab === "history" ? "tab selected" : "tab not-selected"
            }
            onClick={() => setSelectedTab("history")}
          >
            <RestoreIcon fontSize="large" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-block btn-default" onClick={hide}>
          Cancel
        </button>

        <button
          className="btn btn-block btn-primary"
          onClick={handleColorSelection}
        >
          Select
        </button>
      </Modal.Footer>
    </div>
  );
}

export default memo(ColorPickerModal);
