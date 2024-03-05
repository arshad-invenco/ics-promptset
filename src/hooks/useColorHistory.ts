import { useState } from "react";
import Cookies from "js-cookie";
import tinycolor from "tinycolor2";

const useColorHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const length = 40;
  const cookieName = "colors";

  const addToHistory = (color: string) => {
    const newColorObj = tinycolor(color);
    const newColorHex = newColorObj.toHexString();
    const filteredHistory = history.filter(
      (value) => !tinycolor.equals(tinycolor(value).toHexString(), newColorHex)
    );

    const newHistory = [newColorHex, ...filteredHistory.slice(0, length - 1)];
    setHistory(newHistory);
    Cookies.set(cookieName, newHistory.join(","));
  };

  const getHistory = () => {
    const savedHistory = Cookies.get(cookieName);
    if (savedHistory) {
      const parsedHistory = savedHistory.split(",");
      setHistory(parsedHistory);
      return parsedHistory;
    }
    return [];
  };

  const resetHistory = () => {
    setHistory([]);
    Cookies.remove(cookieName);
  };

  return {
    addToHistory,
    getHistory,
    resetHistory,
  };
};

export default useColorHistory;
