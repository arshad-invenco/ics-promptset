import { RefObject, useEffect, useRef, useState } from "react";
import "./searchableDropdown.scss";

interface SearchableDropdownProps {
  label: string;
  items: Array<any>;
  itemRenderer: any;
  onSelect: (item: any) => void;
}

function SearchableDropdown({
  label,
  items,
  itemRenderer,
  onSelect,
}: SearchableDropdownProps) {
  const refs = useRef<RefObject<HTMLLIElement>[]>([]);
  const [open, setOpenStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(label);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const toggleDropdown = () => {
    setOpenStatus(!open);
    setInputValue("");
    setFilteredItems(items);
    if (selectedOption === label) setActiveIndex(0);
  };

  const handleSelection = (item: any) => {
    onSelect(item);
    const formattedItem = `${item.name} (${item.time})`;
    if (label === "Daypart") setSelectedOption(formattedItem);
    setActiveIndex(filteredItems.indexOf(item));
    toggleDropdown();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSelection(items[activeIndex]);
    }
  };

  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    const newFilteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(trimmedInput)
    );
    setFilteredItems(newFilteredItems);
  }, [inputValue, items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
          break;
        case "ArrowUp":
          setActiveIndex(
            (prevIndex) => (prevIndex - 1 + items.length) % items.length
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    refs.current[activeIndex]?.current?.scrollIntoView({
      block: "end",
    });
  }, [activeIndex]);

  return (
    <div className="searchable-dropdown">
      <label>{label}</label>
      <div className="react-select">
        {!open && (
          <div
            className="dropdown-btn"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          >
            <span className={selectedOption !== label ? "selected-item" : ""}>
              {selectedOption}
              <span className="caret"></span>
            </span>
          </div>
        )}
        {open && (
          <input
            placeholder={label}
            aria-label="Select box"
            className="ics-input"
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              handleKeyDown(e);
            }}
            autoFocus
          />
        )}
        {open && filteredItems.length > 0 && (
          <ul className="list-items" onKeyDown={handleKeyDown}>
            {filteredItems.map((item, index) => (
              <li
                key={item.id}
                ref={(el) => (refs.current[index] = { current: el })}
                className={index === activeIndex ? "active" : ""}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleSelection(item);
                }}
              >
                {itemRenderer(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchableDropdown;
