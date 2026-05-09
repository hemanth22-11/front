import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../api/client.js";
import CategoryForm from "./CategoryForm.jsx";
function CreateCategoryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await categoryApi.create(formData);
      navigate("/categories");
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
          <h1>Add category</h1>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <CategoryForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={submitForm}
        loading={loading}
        submitLabel="Create category"
      />
    </section>
  );
}
export default CreateCategoryPage;