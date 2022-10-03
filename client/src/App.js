import './App.css';
// Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Store Manager
import Recoil from "recoil";
// Fonts
import "@fontsource/montserrat";
// Pages
import Signup from "./pages/auth/signup";
import Signin from "./pages/auth/signin";

// User Pages
import UserAccountHomePage from "./pages/acct/userAcctHomePage.js";

// Admin Pages
import AdminHomePage from "./pages/admin/admin.js";

function App() {
  return (
    <Recoil.RecoilRoot>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/signin" element={<Signin />} />

            <Route path="/acct/home" element={< UserAccountHomePage/>} />
            <Route path="/admin" element={<AdminHomePage />} />
          </Routes>
          
        </BrowserRouter>
      </div>
    </Recoil.RecoilRoot>
  );
}

export default App;
