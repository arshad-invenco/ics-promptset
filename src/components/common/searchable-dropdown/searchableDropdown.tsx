import React from "react";
import { RefObject, useEffect, useRef, useState } from "react";
import "./searchableDropdown.scss";

interface SearchableDropdownProps {
  label: string;
  items: Array<any>;
  itemRenderer: any;
  onSelect: (item: any) => void;
  isGroup?: boolean;
  placeholder: string;
  selectedCode?: string;
  reset?: boolean;
  setReset?: () => void;
}

function SearchableDropdown({
  label,
  items,
  itemRenderer,
  onSelect,
  placeholder,
  isGroup = false,
  selectedCode,
  reset,
  setReset,
}: SearchableDropdownProps) {
  const refs = useRef<RefObject<HTMLLIElement>[]>([]);
  const [open, setOpenStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    selectedCode ? selectedCode : placeholder
  );

  const activeKeyCode = () => {
    const flatOptions = items.flatMap((group) => group.options);
    const selectedItem = flatOptions.find((item) => item.name === selectedCode);
    return selectedItem?.id;
  };

  const [activeIndex, setActiveIndex] = useState(
    isGroup
      ? selectedCode
        ? activeKeyCode()
        : items?.[0]?.options?.[0]?.id ?? null
      : items?.[0]?.id ?? null
  );
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const toggleDropdown = () => {
    setOpenStatus(!open);
    setInputValue("");
    setFilteredItems(items);
    if (selectedOption === placeholder) {
      setActiveIndex(
        isGroup ? items?.[0]?.options?.[0]?.id ?? null : items?.[0]?.id ?? null
      );
    }
  };

  const handleSelection = (item: any) => {
    onSelect(item);
    const formattedItem = `${item.name} (${item.time})`;
    if (label === "Daypart") setSelectedOption(formattedItem);
    else setSelectedOption(item.name);
    setActiveIndex(item.id);
    toggleDropdown();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const flatOptions = isGroup
        ? items.flatMap((group) => group.options)
        : items;
      const selectedItem = flatOptions.find((item) => item.id === activeIndex);
      if (selectedItem) {
        handleSelection(selectedItem);
      }
    }
  };

  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();

    const filterItems = (item: any) => {
      const itemName = item.name.toLowerCase();
      let itemCode;
      if (isGroup || label === "Key Code") {
        itemCode = item.code?.toLowerCase();
      }

      return (
        itemName.includes(trimmedInput) || itemCode?.includes(trimmedInput)
      );
    };

    const newFilteredItems = isGroup
      ? items
          .map((group) => ({
            ...group,
            options:
              group.label === "Key or Code"
                ? group.options
                : group.options.filter(filterItems),
          }))
          .filter((group) => group.options.length > 0)
      : items.filter(filterItems);

    setFilteredItems(newFilteredItems);
  }, [inputValue, items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const flatOptions = isGroup
        ? filteredItems.flatMap((group) => group.options)
        : filteredItems;

      switch (event.key) {
        case "ArrowDown":
          setActiveIndex((prevActiveIndex: string) => {
            const prevIndex = flatOptions.findIndex(
              (item) => item.id === prevActiveIndex
            );
            const nextIndex = (prevIndex + 1) % flatOptions.length;
            return flatOptions[nextIndex].id;
          });
          break;
        case "ArrowUp":
          setActiveIndex((prevActiveIndex: string) => {
            const prevIndex = flatOptions.findIndex(
              (item) => item.id === prevActiveIndex
            );
            const newIndex =
              (prevIndex - 1 + flatOptions.length) % flatOptions.length;
            return flatOptions[newIndex].id;
          });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, activeIndex]);

  useEffect(() => {
    refs.current[activeIndex]?.current?.scrollIntoView({
      block: "end",
    });
  }, [activeIndex]);

  useEffect(() => {
    if(reset){
      setSelectedOption(placeholder);
      setReset && setReset();
    }
  }, [selectedCode]);

  const renderListItem = (item: any) => (
    <li
      key={item.id}
      ref={(el) => (refs.current[item.id] = { current: el })}
      className={item.id === activeIndex ? "active" : ""}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleSelection(item);
      }}
    >
      {itemRenderer(item)}
    </li>
  );

  const renderGroup = (group: any, groupIndex: number) => (
    <div className="group-container" key={groupIndex}>
      {group.options.length > 0 && (
        <div className="group-label">{group.label}</div>
      )}
      {group.options.map(renderListItem)}
    </div>
  );

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
            <span
              className={selectedOption !== placeholder ? "selected-item" : ""}
            >
              {selectedOption}
            </span>
            <span className="caret"></span>
          </div>
        )}
        {open && (
          <input
            placeholder={placeholder}
            aria-label="Select box"
            className="ics-input"
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
        {open && filteredItems.length > 0 && (
          <ul
            className={isGroup ? "list-items group-items" : "list-items"}
            onKeyDown={handleKeyDown}
          >
            {!isGroup && filteredItems.map(renderListItem)}
            {isGroup && filteredItems.map(renderGroup)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchableDropdown;
