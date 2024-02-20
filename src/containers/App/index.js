import {BrowserRouter, Route, Routes} from "react-router-dom";
import PromptSet from "../PromptSet/promptSet";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/promptset' element={<PromptSet />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
