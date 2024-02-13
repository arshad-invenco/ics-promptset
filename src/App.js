import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/promptset-layout/layout";
import Toolbar from "./components/Toolbar/toolbar";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Toolbar/>} />
              <Route path='/promptset' element={<Layout/>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
