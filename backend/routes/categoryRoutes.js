const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);

        res.status(500).json({
            message: "Failed to fetch categories",
        });
    }
});

// ASSIGN a field to a category
router.post("/:categoryId/fields", async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { fieldId, displayOrder } = req.body;

        if (!fieldId) {
            return res.status(400).json({
                message: "Field ID is required",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO category_fields (
        category_id,
        field_id,
        display_order
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [
                categoryId,
                fieldId,
                displayOrder || 0,
            ]
        );

        res.status(201).json({
            message: "Field assigned successfully",
            categoryField: result.rows[0],
        });

    } catch (error) {
        console.error("Error assigning field:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Field is already assigned to this category",
            });
        }

        res.status(500).json({
            message: "Failed to assign field",
        });
    }
});

// GET fields for a specific category
router.get("/:categoryId/fields", async (req, res) => {
    try {
        const { categoryId } = req.params;

        const result = await pool.query(
            `
      SELECT
        f.id,
        f.name,
        f.label,
        f.field_type,
        f.required,
        f.placeholder,
        f.default_value,
        f.min_value,
        f.max_value,
        f.min_length,
        f.max_length,
        f.options,
        f.conditional_on_field_id,
        f.conditional_on_value,
        cf.display_order
      FROM category_fields cf
      JOIN fields f
        ON cf.field_id = f.id
      WHERE cf.category_id = $1
      ORDER BY cf.display_order ASC
      `,
            [categoryId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching category fields:", error);

        res.status(500).json({
            message: "Failed to fetch category fields",
        });
    }
});

// CREATE a new category
router.post("/", async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                message: "Category name and slug are required",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO categories (name, slug)
      VALUES ($1, $2)
      RETURNING *
      `,
            [name, slug]
        );

        res.status(201).json({
            message: "Category created successfully",
            category: result.rows[0],
        });

    } catch (error) {
        console.error("Error creating category:", error);

        // Handle duplicate slug
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A category with this slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to create category",
        });
    }
});


// REMOVE a field from a category
router.delete("/:categoryId/fields/:fieldId", async (req, res) => {
    try {
        const { categoryId, fieldId } = req.params;

        const result = await pool.query(
            `
      DELETE FROM category_fields
      WHERE category_id = $1
      AND field_id = $2
      RETURNING *
      `,
            [categoryId, fieldId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Field assignment not found",
            });
        }

        res.json({
            message: "Field removed from category",
        });

    } catch (error) {
        console.error("Error removing field:", error);

        res.status(500).json({
            message: "Failed to remove field",
        });
    }
});

// UPDATE category
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                message: "Name and slug are required",
            });
        }

        const result = await pool.query(
            `
      UPDATE categories
      SET name = $1,
          slug = $2
      WHERE id = $3
      RETURNING *
      `,
            [name, slug, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.json({
            message: "Category updated successfully",
            category: result.rows[0],
        });

    } catch (error) {
        console.error("Error updating category:", error);

        res.status(500).json({
            message: "Failed to update category",
        });
    }
});

// DELETE category
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      DELETE FROM categories
      WHERE id = $1
      RETURNING *
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.json({
            message: "Category deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting category:", error);

        res.status(500).json({
            message: "Failed to delete category",
        });
    }
});

// UPDATE field order inside a category
router.put("/:categoryId/fields/:fieldId/order", async (req, res) => {
    try {
        const { categoryId, fieldId } = req.params;
        const { displayOrder } = req.body;

        if (displayOrder === undefined) {
            return res.status(400).json({
                message: "Display order is required",
            });
        }

        const result = await pool.query(
            `
      UPDATE category_fields
      SET display_order = $1
      WHERE category_id = $2
      AND field_id = $3
      RETURNING *
      `,
            [displayOrder, categoryId, fieldId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Field assignment not found",
            });
        }

        res.json({
            message: "Field order updated successfully",
            categoryField: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating field order:", error);

        res.status(500).json({
            message: "Failed to update field order",
        });
    }
});

module.exports = router;