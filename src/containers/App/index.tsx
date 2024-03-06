import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PromptSet } from "../PromptSet/promptSet";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/media/promptsets/:id' element={<PromptSet/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
