import { useEffect, useState } from "react";

function SellProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fields, setFields] = useState([]);

  // Common listing information
  const [listingData, setListingData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
  });

  // Category-specific field values
  const [fieldValues, setFieldValues] = useState({});

  // Handle common listing fields
  const handleListingChange = (e) => {
    const { name, value } = e.target;

    setListingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dynamic category fields
  const handleFieldChange = (fieldName, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  // Fetch fields whenever category changes
  useEffect(() => {
    if (!selectedCategory) {
      setFields([]);
      setFieldValues({});
      return;
    }

    fetch(`http://localhost:5000/api/categories/${selectedCategory}/fields`)
      .then((response) => response.json())
      .then((data) => {
        setFields(data);
        setFieldValues({});
      })
      .catch((error) => console.error(error));
  }, [selectedCategory]);

  // Submit for now
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: selectedCategory,
          ...listingData,
          fieldValues,
        }),
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create listing");
      }

      alert("Listing created successfully!");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing");
    }
  };

  const isFieldVisible = (field) => {
    if (!field.conditional_on_field_id) {
      return true;
    }

    const parentField = fields.find(
      (f) => f.id === field.conditional_on_field_id,
    );

    if (!parentField) {
      return true;
    }

    return (
      String(fieldValues[parentField.name] ?? "") ===
      String(field.conditional_on_value ?? "")
    );
  };

  return (
    <div>
      <h1>Sell Product</h1>

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div>
          <label>Category *</label>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <hr />

        {/* Common Listing Information */}
        <h2>Basic Details</h2>

        <div>
          <label>Title *</label>

          <input
            type="text"
            name="title"
            value={listingData.title}
            onChange={handleListingChange}
            placeholder="What are you selling?"
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={listingData.description}
            onChange={handleListingChange}
            placeholder="Describe your product"
          />
        </div>

        <div>
          <label>Price *</label>

          <input
            type="number"
            name="price"
            value={listingData.price}
            onChange={handleListingChange}
            placeholder="Enter price"
            min="0"
            required
          />
        </div>

        <div>
          <label>Condition</label>

          <select
            name="condition"
            value={listingData.condition}
            onChange={handleListingChange}
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        <hr />

        {/* Dynamic Category Fields */}
        {selectedCategory && (
          <>
            <h2>Category Specific Details</h2>

            {fields.filter(isFieldVisible).map((field) => (
              <div key={field.id}>
                <label>
                  {field.label}
                  {field.required && " *"}
                </label>

                {/* TEXT */}
                {field.field_type === "text" && (
                  <input
                    type="text"
                    value={fieldValues[field.name] || ""}
                    placeholder={field.placeholder || ""}
                    minLength={field.min_length || undefined}
                    maxLength={field.max_length || undefined}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                )}

                {/* TEXT-AREA */}
                {field.field_type === "textarea" && (
                  <textarea
                    value={fieldValues[field.name] || ""}
                    placeholder={field.placeholder || ""}
                    minLength={field.min_length || undefined}
                    maxLength={field.max_length || undefined}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                )}

                {/* DATE */}
                {field.field_type === "date" && (
                  <input
                    type="date"
                    value={fieldValues[field.name] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                )}

                {/* NUMBER */}
                {field.field_type === "number" && (
                  <input
                    type="number"
                    value={fieldValues[field.name] || ""}
                    min={field.min_value || undefined}
                    max={field.max_value || undefined}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                )}

                {/* SELECT */}
                {field.field_type === "select" && (
                  <select
                    value={fieldValues[field.name] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>

                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {/* CHECKBOX */}
                {field.field_type === "checkbox" && (
                  <input
                    type="checkbox"
                    checked={fieldValues[field.name] || false}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.checked)
                    }
                  />
                )}

                {/* RADIO */}
                {field.field_type === "radio" &&
                  field.options?.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={fieldValues[field.name] === option}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.value)
                        }
                        required={field.required}
                      />

                      {option}
                    </label>
                  ))}
              </div>
            ))}
          </>
        )}

        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
}

export default SellProduct;
