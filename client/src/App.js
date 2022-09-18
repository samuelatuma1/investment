import './App.css';
// Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Store Manager

// Fonts
import "@fontsource/montserrat";
// Pages
import Signup from "./pages/auth/signup";
import Signin from "./pages/auth/signin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signup" element={<Signup />} />
        </Routes>
        <Routes>
          <Route path="/auth/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
