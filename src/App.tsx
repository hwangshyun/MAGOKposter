import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import MovieAdd from "./pages/MovieAdd";
import PosterManager from "./pages/PosterManager";
import "./App.css";
import Layout from "./components/Layout";
import OfferList from "./pages/MainOfferList";
import Mainpage from "./pages/Mainpage";
import Notice from "./pages/Notice";
import Login from "./pages/Login";
import SignUp from "./pages/Signup"; // 정확한 파일명을 사용

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <Mainpage />
                </PrivateRoute>
              }
            />
            <Route
              path="/poster"
              element={
                <PrivateRoute>
                  <MovieAdd />
                </PrivateRoute>
              }
            />
            <Route
              path="/postermanager"
              element={
                <PrivateRoute>
                  <PosterManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/offer"
              element={
                <PrivateRoute>
                  <OfferList />
                </PrivateRoute>
              }
            />
            <Route
              path="/notice"
              element={
                <PrivateRoute>
                  <Notice />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
