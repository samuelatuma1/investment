import './App.css';
// Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
// Fonts
import "@fontsource/montserrat";
// Pages
import Signup from "./pages/auth/signup";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>

      
    </div>
  );
}

export default App;
