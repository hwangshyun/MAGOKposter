import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import MovieAdd from "./pages/MovieAdd";
import PosterManager from "./pages/PosterManager";
import "./App.css";
import Layout from "./components/Layout";
import OfferList from "./pages/MainOfferList";
import Mainpage from "./pages/Mainpage";
import Notice from "./pages/Notice";
import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/signup" element={<SignUp />} /> */}
              <Route path="/" element={<Navigate to="/main" />} />
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
    </QueryClientProvider>
  );
};

export default App;
