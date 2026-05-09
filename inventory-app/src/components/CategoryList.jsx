import { Edit3, FolderKanban, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../api/client.js";
function CategoryList({ isAdmin }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      setCategories(await categoryApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadCategories();
  }, []);
  async function removeCategory(category) {
    const confirmed = window.confirm(`Delete ${category.name}?`);
    if (!confirmed) return;
    setError("");
    setMessage("");
    try {
      await categoryApi.remove(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      setMessage("Category deleted.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <div className="section-kicker">Catalogue</div>
          <h1>Categories</h1>
        </div>
        {isAdmin && (
          <Link className="primary-button slim" to="/categories/new">
            <Plus size={18} />
            Add category
          </Link>
        )}
      </div>
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      {loading ? (
        <div className="empty-state">Loading categories...</div>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <div className="category-icon">
                <FolderKanban size={24} />
              </div>
              <div>
                <h2>{category.name}</h2>
                <p>{category.description || "No description added."}</p>
              </div>
              {isAdmin && (
                <div className="card-actions">
                  <Link className="icon-button" to={`/categories/${category.id}/edit`} title="Edit category">
                    <Edit3 size={17} />
                  </Link>
                  <button
                    className="icon-button danger"
                    type="button"
                    onClick={() => removeCategory(category)}
                    title="Delete category"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export default CategoryList;