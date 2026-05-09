import { Edit3, Package, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { categoryApi, productApi } from "../api/client.js";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ProductList({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inventoryValue = useMemo(
    () => products.reduce((total, product) => total + product.price * product.stock, 0),
    [products]
  );

  async function loadData(nextFilters = { categoryId, search }) {
    setLoading(true);
    setError("");
    try {
      const [categoryData, productData] = await Promise.all([
        categoryApi.list(),
        productApi.list(nextFilters),
      ]);
      setCategories(categoryData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
   loadData();
  }, []);

  async function removeProduct(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    setMessage("");
    setError("");
    try {
      await productApi.remove(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setMessage("Product deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  function submitFilters(event) {
    event.preventDefault();
    loadData({ categoryId, search });
  }

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <div className="section-kicker">Catalogue</div>
          <h1>Products</h1>
        </div>
        {isAdmin && (
          <Link className="primary-button slim" to="/products/new">
            <Plus size={18} />
            Add product
          </Link>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat-card">
          <span>Stock units</span>
          <strong>{products.reduce((total, product) => total + product.stock, 0)}</strong>
        </div>
        <div className="stat-card accent">
          <span>Inventory value</span>
          <strong>{currencyFormatter.format(inventoryValue)}</strong>
        </div>
      </div>

      <form className="toolbar" onSubmit={submitFilters}>
        <div className="input-shell grow">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
          />
        </div>

        <div className="input-shell select-shell">
          <SlidersHorizontal size={18} />
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="secondary-button" type="submit">
          Filter
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-visual">
                <Package size={18} />
                <span>{product.category_name || "Product"}</span>
              </div>
              <div className="product-body">
                <div>
                  <h2>{product.name}</h2>
                  <p>{product.description || "No description added."}</p>
                </div>
                <div className="product-meta">
                  <strong>{currencyFormatter.format(product.price)}</strong>
                  <span className={product.stock <= 10 ? "stock low" : "stock"}>
                    {product.stock} in stock
                  </span>
                </div>
              </div>
              {isAdmin && (
                <div className="card-actions">
                  <Link className="icon-button" to={`/products/${product.id}/edit`} title="Edit product">
                    <Edit3 size={17} />
                  </Link>
                  <button
                    className="icon-button danger"
                    type="button"
                    onClick={() => removeProduct(product)}
                    title="Delete product"
                    aria-label={`Delete ${product.name}`}
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

export default ProductList;