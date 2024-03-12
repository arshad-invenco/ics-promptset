import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PromptSet } from "../PromptSet/promptSet";
import { Provider } from "react-redux";
import store from "../../redux/store";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/media/promptsets/:id" element={<PromptSet />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
