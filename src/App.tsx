import { useState } from "react";
import LoginForm from "./components/LoginForm";
import AdminPage from "./pages/AdminPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <AdminPage />;
}

export default App;