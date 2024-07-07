import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MovieAdd from "./pages/MovieAdd";
import PosterManager from "./pages/PosterManager";
import "./App.css";
import Layout from "./components/Layout";
import OfferList from "./pages/MainOfferList";
import Mainpage from "./pages/Mainpage";
import Notice from "./pages/Notice";
const App: React.FC = () => {
  const savedMovies = JSON.parse(localStorage.getItem("movies") || "[]");

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Mainpage/>}/>
          <Route path="/poster" element={<MovieAdd />} />
          <Route
            path="/postermanager"
            element={<PosterManager savedMovies={savedMovies} />}
          />

          <Route path="/offer" element={<OfferList />} />
          <Route path="/notice" element={<Notice/>}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
