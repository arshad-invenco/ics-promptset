import { useState } from "react";
import "./colorPicker.scss";
import {
  ColorPicker,
  ColorPickerChangeEvent,
  ColorPickerHSBType,
  ColorPickerRGBType,
} from "primereact/colorpicker";
import { Modal } from "react-bootstrap";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  hide: () => void;
}

function ColorPickerModal({ value, onChange, hide }: ColorPickerProps) {
  const [color, setColor] = useState<string>(value ?? "#000000");

  return (
    <div className="color-picker">
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <ColorPicker
          value={color}
          onChange={(e: ColorPickerChangeEvent) => {
            const newValue:
              | string
              | ColorPickerRGBType
              | ColorPickerHSBType
              | undefined = e.value ?? "";
            if (typeof newValue === "string") {
              setColor(newValue);
            }
          }}
          inline
          />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </div>
  );
}

export default ColorPickerModal;
