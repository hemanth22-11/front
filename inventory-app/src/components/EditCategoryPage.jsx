import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryApi } from "../api/client.js";
import CategoryForm from "./CategoryForm.jsx";
function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadCategory() {
      try {
        const categories = await categoryApi.list();
        const category = categories.find((item) => String(item.id) === String(id));
        if (!category) {
          throw new Error("Category not found");
        }
        setFormData({
          name: category.name,
          description: category.description || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    loadCategory();
  }, [id]);
  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await categoryApi.update(id, formData);
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
          <h1>Edit category</h1>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      {formData ? (
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={submitForm}
          loading={loading}
          submitLabel="Update category"
        />
      ) : (
        <div className="empty-state">Loading category...</div>
      )}
    </section>
  );
}
export default EditCategoryPage;