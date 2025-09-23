// src/main.jsx
import ReactDOM from "react-dom/client"; // 👈 yeh line missing thi
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";
import "./index.css"; // Ensure this exists
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
);
