import { Save, X } from "lucide-react";
import { Link } from "react-router-dom";
function CategoryForm({ formData, setFormData, onSubmit, loading, submitLabel }) {
  function updateField(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }
  return (
    <form className="editor-form" onSubmit={onSubmit}>
      <label>
        Category name
        <input name="name" value={formData.name} onChange={updateField} required />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={updateField}
          rows="8"
          placeholder="What belongs in this category?"
        />
      </label>
      <div className="form-actions">
        <Link className="secondary-button" to="/categories">
          <X size={18} />
          Cancel
        </Link>
        <button className="primary-button" type="submit" disabled={loading}>
          <Save size={18} />
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
export default CategoryForm;