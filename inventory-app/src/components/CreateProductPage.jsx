import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi, productApi } from "../api/client.js";
import ProductForm from "./ProductForm.jsx";
const emptyProduct = {
  name: "",
  price: "",
  category_id: "",
  stock: 0,
  description: "",
};
function CreateProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    categoryApi.list().then(setCategories).catch((err) => setError(err.message));
  }, []);
  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await productApi.create(formData);
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
          <h1>Add product</h1>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <ProductForm
        categories={categories}
        formData={formData}
        setFormData={setFormData}
        onSubmit={submitForm}
        loading={loading}
        submitLabel="Create product"
      />
    </section>
  );
}
export default CreateProductPage;