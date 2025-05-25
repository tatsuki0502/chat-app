import './App.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [user] = useAuthState(auth);

  return user?
    <Chat /> : <Login />;
  
}

export default App
