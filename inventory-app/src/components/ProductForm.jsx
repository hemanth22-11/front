import { Save, X } from "lucide-react";
import { Link } from "react-router-dom";

function ProductForm({ categories, formData, setFormData, onSubmit, loading, submitLabel }) {
  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "price" || name === "stock" || name === "category_id" ? Number(value) : value,
    }));
  }

  return (
    <form className="editor-form" onSubmit={onSubmit}>
      <label>
        Product name
        <input name="name" value={formData.name} onChange={updateField} required />
      </label>

      <div className="two-column">
        <label>
          Price
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={updateField}
            required
          />
        </label>

        <label>
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={updateField}
            required
          />
        </label>
      </div>

      <label>
        Category
        <select name="category_id" value={formData.category_id} onChange={updateField} required>
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={updateField}
          rows="4"
          placeholder="Short product notes"
        />
      </label>

      <div className="form-actions">
        <Link className="secondary-button" to="/products">
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

export default ProductForm;