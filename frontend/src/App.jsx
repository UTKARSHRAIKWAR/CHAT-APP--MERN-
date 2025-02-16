import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" Component={HomePage} exact />
        <Route path="/chats" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
