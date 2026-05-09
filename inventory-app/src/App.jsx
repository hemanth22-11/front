import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProductList from "./components/ProductList.jsx";
import CategoryForm from "./components/CategoryForm.jsx";
import CreateProductPage from "./components/CreateProductPage.jsx";
import EditProductPage from "./components/EditProductPage.jsx";
import CategoryList from "./components/CategoryList.jsx";
import CreateCategoryPage from "./components/CreateCategoryPage.jsx";
import EditCategoryPage from "./components/EditCategoryPage.jsx";
import { clearSession, getStoredUser, saveSession } from "./api/client.js";
import ProductForm from "./components/ProductForm.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  const isAdmin = useMemo(() => currentUser?.role === "admin", [currentUser]);

  function handleLogin(session) {
    saveSession(session);
    setCurrentUser({ username: session.username, role: session.role });
  }

  function handleLogout() {
    clearSession();
    setCurrentUser(null);
  }

  return (
    <div className="app-shell">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to={currentUser ? "/products" : "/login"} replace />} />
          <Route path="/login" element={<LoginForm currentUser={currentUser} onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm currentUser={currentUser} />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <ProductList isAdmin={isAdmin} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="admin">
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="admin">
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <CategoryList isAdmin={isAdmin} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/new"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="admin">
                <CreateCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id/edit"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="admin">
                <EditCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;