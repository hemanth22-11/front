import { Boxes, Grid2X2, LogOut, PackagePlus, Plus, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
function Header({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "admin";
  function logout() {
    onLogout();
    navigate("/login");
  }
  return (
    <header className="topbar">
      <div className="brand" onClick={() => navigate("/products")} role="button" tabIndex={0}>
        <div className="brand-mark">
          <Boxes size={22} />
        </div>
        <div>
          <strong>Product Inventory</strong>
        </div>
      </div>
      {currentUser && (
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/products">
            <PackagePlus size={18} />
            Products
          </NavLink>
          <NavLink to="/categories">
            <Grid2X2 size={18} />
            Categories
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/products/new">
                <Plus size={18} />
                Product
              </NavLink>
              <NavLink to="/categories/new">
                <Plus size={18} />
                Category
              </NavLink>
            </>
          )}
        </nav>
      )}
      <div className="header-actions">
        {currentUser ? (
          <>
            <span className={`role-pill ${isAdmin ? "admin" : ""}`}>
              {isAdmin && <ShieldCheck size={15} />}
              {currentUser.username} · {currentUser.role}
            </span>
            <button className="icon-button" type="button" onClick={logout} title="Logout" aria-label="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <span className="role-pill">Guest</span>
        )}
      </div>
    </header>
  );
}
export default Header;