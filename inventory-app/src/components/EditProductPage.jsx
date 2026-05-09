import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryApi, productApi } from "../api/client.js";
import ProductForm from "./ProductForm.jsx";
function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function loadPage() {
      try {
        const [categoryData, productData] = await Promise.all([
          categoryApi.list(),
          productApi.get(id),
        ]);
        setCategories(categoryData);
        setFormData({
          name: productData.name,
          price: productData.price,
          category_id: productData.category_id,
          stock: productData.stock,
          description: productData.description || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    loadPage();
  }, [id]);
  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await productApi.update(id, formData);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="editor-page">
      <div className="page-head">
        <div>
          <div className="section-kicker">Admin</div>
          <h1>Edit product</h1>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      {formData ? (
        <ProductForm
          categories={categories}
          formData={formData}
          setFormData={setFormData}
          onSubmit={submitForm}
          loading={loading}
          submitLabel="Update product"
        />
      ) : (
        <div className="empty-state">Loading product...</div>
      )}
    </section>
  );
}
export default EditProductPage;