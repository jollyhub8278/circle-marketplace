import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  // =============================
  // STATE
  // =============================

  const [categories, setCategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [fieldForm, setFieldForm] = useState({
    name: "",
    label: "",
    fieldType: "text",
    required: false,
    placeholder: "",
    minValue: "",
    maxValue: "",
    options: "",
    conditionalOnFieldId: "",
    conditionalOnValue: "",
  });

  // =============================
  // FETCH CATEGORIES
  // =============================

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // =============================
  // FETCH ALL FIELDS
  // =============================

  const fetchFields = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fields`);

      const data = await response.json();

      setFields(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  // =============================
  // FETCH FIELDS FOR CATEGORY
  // =============================

  const fetchCategoryFields = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/categories/${categoryId}/fields`,
      );

      const data = await response.json();

      setCategoryFields(data);
    } catch (error) {
      console.error("Error fetching category fields:", error);
    }
  };

  // =============================
  // INITIAL DATA
  // =============================

useEffect(() => {
  const loadInitialData = async () => {
    try {
      const [categoriesResponse, fieldsResponse] = await Promise.all([
        fetch(`${API_URL}/api/categories`),
        fetch(`${API_URL}/api/fields`),
      ]);

      const categoriesData = await categoriesResponse.json();
      const fieldsData = await fieldsResponse.json();

      setCategories(categoriesData);
      setFields(fieldsData);
    } catch (error) {
      console.error("Error loading initial admin data:", error);
    }
  };

  loadInitialData();
}, []);

  // =============================
  // CREATE CATEGORY
  // =============================

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    const slug = categoryName.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCategoryName("");

      await fetchCategories();

      alert("Category created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =============================
  // EDIT Field
  // =============================
  const handleEditField = (field) => {
    setEditingField(field);

    setFieldForm({
      name: field.name || "",
      label: field.label || "",
      fieldType: field.field_type || "text",
      required: field.required || false,
      placeholder: field.placeholder || "",
      minValue: field.min_value || "",
      maxValue: field.max_value || "",
      options: field.options ? field.options.join(", ") : "",
      conditionalOnFieldId: field.conditional_on_field_id || "",
      conditionalOnValue: field.conditional_on_value || "",
    });
  };

  // =============================
  // FIELD FORM CHANGE
  // =============================

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFieldForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =============================
  // CREATE FIELD
  // =============================

  const handleCreateField = async (e) => {
    e.preventDefault();

    const url = editingField
      ? `${API_URL}/api/fields/${editingField.id}`
      : `${API_URL}/api/fields`;

    const method = editingField ? "PUT" : "POST";

    try {
      let options = null;

      if (fieldForm.fieldType === "select" || fieldForm.fieldType === "radio") {
        options = fieldForm.options
          .split(",")
          .map((option) => option.trim())
          .filter(Boolean);

        if (options.length === 0) {
          alert("Please enter at least one option.");
          return;
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fieldForm.name.trim(),
          label: fieldForm.label.trim(),
          fieldType: fieldForm.fieldType,
          required: fieldForm.required,
          placeholder: fieldForm.placeholder.trim() || null,
          minValue:
            fieldForm.minValue !== "" ? Number(fieldForm.minValue) : null,
          maxValue:
            fieldForm.maxValue !== "" ? Number(fieldForm.maxValue) : null,
          options,
          conditionalOnFieldId: fieldForm.conditionalOnFieldId
            ? Number(fieldForm.conditionalOnFieldId)
            : null,

          conditionalOnValue: fieldForm.conditionalOnValue.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setFieldForm({
        name: "",
        label: "",
        fieldType: "text",
        required: false,
        placeholder: "",
        minValue: "",
        maxValue: "",
        options: "",
        conditionalOnFieldId: "",
        conditionalOnValue: "",
      });

      await fetchFields();

      alert("Field created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =============================
  // DELETE FIELD
  // =============================

  const handleDeleteField = async (fieldId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this field?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/fields/${fieldId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchFields();

      // Refresh selected category fields too
      if (selectedCategory) {
        await fetchCategoryFields(selectedCategory.id);
      }

      alert("Field deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =============================
  // SELECT / UNSELECT FIELD
  // =============================

  const toggleField = (fieldId) => {
    setSelectedFields((prev) => {
      if (prev.includes(fieldId)) {
        return prev.filter((id) => id !== fieldId);
      }

      return [...prev, fieldId];
    });
  };

  // =============================
  // ADD SELECTED FIELDS
  // =============================

  const handleAddFields = async () => {
    if (!selectedCategory) {
      return;
    }

    if (selectedFields.length === 0) {
      alert("Please select at least one field.");
      return;
    }

    try {
      for (let i = 0; i < selectedFields.length; i++) {
        const response = await fetch(
          `${API_URL}/api/categories/${selectedCategory.id}/fields`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fieldId: selectedFields[i],
              displayOrder: categoryFields.length + i + 1,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }
      }

      setSelectedFields([]);

      await fetchCategoryFields(selectedCategory.id);
    } catch (error) {
      console.error("Error adding fields:", error);

      alert(error.message);
    }
  };

  // =============================
  // REMOVE FIELD FROM CATEGORY
  // =============================

  const handleRemoveField = async (categoryId, fieldId) => {
    const confirmed = window.confirm("Remove this field from the category?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${categoryId}/fields/${fieldId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchCategoryFields(categoryId);
    } catch (error) {
      console.error("Error removing field:", error);

      alert(error.message);
    }
  };

  // =============================
  // MANAGE CATEGORY
  // =============================

  const handleManageCategory = (category) => {
    setSelectedCategory(category);
    setSelectedFields([]);

    fetchCategoryFields(category.id);
  };

  // =============================
  // EDIT CATEGORY
  // =============================

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  // =============================
  // UPDATE CATEGORY
  // =============================

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    const slug = categoryName.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName.trim(),
            slug,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setEditingCategory(null);
      setCategoryName("");

      await fetchCategories();

      alert("Category updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  // =============================
  // DELETE CATEGORY
  // =============================

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (selectedCategory && selectedCategory.id === categoryId) {
        setSelectedCategory(null);
        setCategoryFields([]);
      }

      await fetchCategories();

      alert("Category deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =============================
  // MOVE FIELD
  // =============================
  const moveField = async (index, direction) => {
    if (!selectedCategory) return;

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= categoryFields.length) {
      return;
    }

    const currentField = categoryFields[index];
    const targetField = categoryFields[newIndex];

    try {
      // Swap display orders
      await fetch(
        `${API_URL}/api/categories/${selectedCategory.id}/fields/${currentField.id}/order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayOrder: targetField.display_order,
          }),
        },
      );

      await fetch(
        `${API_URL}/api/categories/${selectedCategory.id}/fields/${targetField.id}/order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayOrder: currentField.display_order,
          }),
        },
      );

      await fetchCategoryFields(selectedCategory.id);
    } catch (error) {
      console.error("Error moving field:", error);
    }
  };
  // =============================
  // UI
  // =============================

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>Admin Dashboard</h1>

      {/* =====================================
          CATEGORIES
      ===================================== */}

      <section>
        <h2>Categories</h2>

        <form
          onSubmit={
            editingCategory ? handleUpdateCategory : handleCreateCategory
          }
        >
          <input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <button type="submit">
            {editingCategory ? "Update Category" : "Create Category"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <br />

        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              marginBottom: "10px",
            }}
          >
            <strong>{category.name}</strong>

            {" — "}

            <span>{category.slug}</span>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleEditCategory(category)}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDeleteCategory(category.id)}
            >
              Delete
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleManageCategory(category)}
            >
              Manage Fields
            </button>
          </div>
        ))}
      </section>

      {/* =====================================
          CATEGORY FIELD MANAGEMENT
      ===================================== */}

      {selectedCategory && (
        <>
          <hr />

          <section>
            <h2>Manage Fields — {selectedCategory.name}</h2>

            {/* ASSIGNED FIELDS */}

            <h3>Assigned Fields</h3>

            {categoryFields.length === 0 ? (
              <p>No fields assigned to this category yet.</p>
            ) : (
              categoryFields.map((field, index) => (
                <div
                  key={field.id}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    {index + 1}. {field.label}
                  </strong>

                  {" — "}

                  <span>{field.field_type}</span>

                  {field.required && <span> — Required</span>}

                  <button
                    style={{ marginLeft: "10px" }}
                    disabled={index === 0}
                    onClick={() => moveField(index, -1)}
                  >
                    ↑
                  </button>

                  <button
                    disabled={index === categoryFields.length - 1}
                    onClick={() => moveField(index, 1)}
                  >
                    ↓
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      handleRemoveField(selectedCategory.id, field.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))
            )}

            {/* AVAILABLE FIELDS */}

            <h3>Available Fields</h3>

            {fields.filter(
              (field) =>
                !categoryFields.some((assigned) => assigned.id === field.id),
            ).length === 0 ? (
              <p>All available fields are already assigned.</p>
            ) : (
              fields
                .filter(
                  (field) =>
                    !categoryFields.some(
                      (assigned) => assigned.id === field.id,
                    ),
                )
                .map((field) => (
                  <label
                    key={field.id}
                    style={{
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.id)}
                      onChange={() => toggleField(field.id)}
                    />{" "}
                    {field.label}
                    {" — "}
                    {field.field_type}
                  </label>
                ))
            )}

            <br />

            <button
              onClick={handleAddFields}
              disabled={selectedFields.length === 0}
            >
              Add Selected Fields
            </button>

            <button
              style={{
                marginLeft: "10px",
              }}
              onClick={() => {
                setSelectedCategory(null);
                setCategoryFields([]);
                setSelectedFields([]);
              }}
            >
              Close
            </button>
          </section>
        </>
      )}

      <hr />

      {/* =====================================
          CREATE LISTING FIELD
      ===================================== */}

      <section>
        <h2>{editingField ? "Edit Listing Field" : "Create Listing Field"}</h2>
        <form onSubmit={handleCreateField}>
          {/* FIELD NAME */}

          <div>
            <label>Field Name</label>

            <br />

            <input
              type="text"
              name="name"
              placeholder="e.g. battery_health"
              value={fieldForm.name}
              onChange={handleFieldChange}
              required
            />
          </div>

          <br />

          {/* LABEL */}

          <div>
            <label>Label</label>

            <br />

            <input
              type="text"
              name="label"
              placeholder="e.g. Battery Health"
              value={fieldForm.label}
              onChange={handleFieldChange}
              required
            />
          </div>

          <br />

          {/* FIELD TYPE */}

          <div>
            <label>Field Type</label>

            <br />

            <select
              name="fieldType"
              value={fieldForm.fieldType}
              onChange={handleFieldChange}
            >
              <option value="text">Text</option>

              <option value="textarea">Textarea</option>

              <option value="number">Number</option>

              <option value="select">Select / Dropdown</option>

              <option value="radio">Radio</option>

              <option value="checkbox">Checkbox</option>

              <option value="date">Date</option>
            </select>
          </div>

          <br />

          {/* REQUIRED */}

          <div>
            <label>
              <input
                type="checkbox"
                name="required"
                checked={fieldForm.required}
                onChange={handleFieldChange}
              />{" "}
              Required
            </label>
          </div>

          <br />

          {/* PLACEHOLDER */}

          <div>
            <label>Placeholder</label>

            <br />

            <input
              type="text"
              name="placeholder"
              placeholder="Optional"
              value={fieldForm.placeholder}
              onChange={handleFieldChange}
            />
          </div>

          <br />

          {/* NUMBER SETTINGS */}

          {fieldForm.fieldType === "number" && (
            <>
              <div>
                <label>Minimum Value</label>

                <br />

                <input
                  type="number"
                  name="minValue"
                  value={fieldForm.minValue}
                  onChange={handleFieldChange}
                />
              </div>

              <br />

              <div>
                <label>Maximum Value</label>

                <br />

                <input
                  type="number"
                  name="maxValue"
                  value={fieldForm.maxValue}
                  onChange={handleFieldChange}
                />
              </div>

              <br />
            </>
          )}

          {/* SELECT / RADIO OPTIONS */}

          {(fieldForm.fieldType === "select" ||
            fieldForm.fieldType === "radio") && (
            <>
              <div>
                <label>Options</label>

                <br />

                <input
                  type="text"
                  name="options"
                  placeholder="64GB, 128GB, 256GB"
                  value={fieldForm.options}
                  onChange={handleFieldChange}
                />

                <br />

                <small>Separate options with commas.</small>
              </div>

              <br />
            </>
          )}

          {/* CONDITIONAL FIELD */}

          <div>
            <label>Show this field only when</label>

            <br />

            <select
              name="conditionalOnFieldId"
              value={fieldForm.conditionalOnFieldId}
              onChange={handleFieldChange}
            >
              <option value="">No condition</option>

              {fields
                .filter(
                  (field) => !editingField || field.id !== editingField.id,
                )
                .map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
            </select>
          </div>

          {fieldForm.conditionalOnFieldId && (
            <div>
              <br />

              <label>Show when value is</label>

              <br />

              <input
                type="text"
                name="conditionalOnValue"
                placeholder="e.g. Yes"
                value={fieldForm.conditionalOnValue}
                onChange={handleFieldChange}
              />
            </div>
          )}

          <br />

          <button type="submit">
            {editingField ? "Update Field" : "Create Field"}
          </button>

          {editingField && (
            <button
              type="button"
              onClick={() => {
                setEditingField(null);

                setFieldForm({
                  name: "",
                  label: "",
                  fieldType: "text",
                  required: false,
                  placeholder: "",
                  minValue: "",
                  maxValue: "",
                  options: "",
                  conditionalOnFieldId: "",
                  conditionalOnValue: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <hr />

      {/* =====================================
        ALL LISTING FIELDS
      ===================================== */}

      <section>
        <h2>Listing Fields</h2>

        {fields.length === 0 ? (
          <p>No fields found.</p>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              style={{
                marginBottom: "12px",
              }}
            >
              <strong>{field.label}</strong>

              {" — "}

              <span>{field.field_type}</span>

              {field.required && <span> — Required</span>}

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleEditField(field)}
              >
                Edit
              </button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleDeleteField(field.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Admin;
