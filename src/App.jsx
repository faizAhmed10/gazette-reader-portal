import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArticleListPage from "./pages/ArticleListPage";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/Navbar";
import AllArticlesPage from "./pages/AllArticlesPage";
import Article from "./pages/Article";
import { useContext } from "react";
import ReaderContext from "./utils/ReaderContext";

const App = () => {

  let {authTokens} = useContext(ReaderContext)
  return (
    <div>
      {authTokens && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todays-articles"
          element={<PrivateRoute element={<ArticleListPage />} />}
        />
        <Route
          path="/all-articles"
          element={<PrivateRoute element={<AllArticlesPage />} />}
        />
        <Route
          path="/article/:id"
          element={<PrivateRoute element={<Article />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
