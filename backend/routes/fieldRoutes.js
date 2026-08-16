const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all fields
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM fields ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching fields:", error);

        res.status(500).json({
            message: "Failed to fetch fields",
        });
    }
});

// CREATE a field
router.post("/", async (req, res) => {
    try {
        const {
            name,
            label,
            fieldType,
            required,
            placeholder,
            defaultValue,
            minValue,
            maxValue,
            minLength,
            maxLength,
            options,
            conditionalOnFieldId,
            conditionalOnValue,
        } = req.body;

        if (!name || !label || !fieldType) {
            return res.status(400).json({
                message: "Name, label and field type are required",
            });
        }

        const result = await pool.query(
            `
      INSERT INTO fields (
        name,
        label,
        field_type,
        required,
        placeholder,
        default_value,
        min_value,
        max_value,
        min_length,
        max_length,
        options,
        conditional_on_field_id,
        conditional_on_value
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *
      `,
            [
                [
                    name,
                    label,
                    fieldType,
                    required || false,
                    placeholder || null,
                    defaultValue || null,
                    minValue || null,
                    maxValue || null,
                    minLength || null,
                    maxLength || null,
                    options ? JSON.stringify(options) : null,
                    conditionalOnFieldId || null,
                    conditionalOnValue || null,
                ]
            ]
        );

        res.status(201).json({
            message: "Field created successfully",
            field: result.rows[0],
        });

    } catch (error) {
        console.error("Error creating field:", error);

        res.status(500).json({
            message: "Failed to create field",
        });
    }
});


// UPDATE a field
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            label,
            fieldType,
            required,
            placeholder,
            defaultValue,
            minValue,
            maxValue,
            minLength,
            maxLength,
            options,
            conditionalOnFieldId,
            conditionalOnValue,
        } = req.body;

        const result = await pool.query(
            `
      UPDATE fields
      SET
        name = $1,
        label = $2,
        field_type = $3,
        required = $4,
        placeholder = $5,
        default_value = $6,
        min_value = $7,
        max_value = $8,
        min_length = $9,
        max_length = $10,
        options = $11,
        conditional_on_field_id = $12,
        conditional_on_value = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
      `,
            [
                name,
                label,
                fieldType,
                required || false,
                placeholder || null,
                defaultValue || null,
                minValue || null,
                maxValue || null,
                minLength || null,
                maxLength || null,
                options ? JSON.stringify(options) : null,
                conditionalOnFieldId || null,
                conditionalOnValue || null,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Field not found",
            });
        }

        res.json({
            message: "Field updated successfully",
            field: result.rows[0],
        });

    } catch (error) {
        console.error("Error updating field:", error);

        res.status(500).json({
            message: "Failed to update field",
        });
    }
});

// DELETE a field
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      DELETE FROM fields
      WHERE id = $1
      RETURNING *
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Field not found",
            });
        }

        res.json({
            message: "Field deleted successfully",
            field: result.rows[0],
        });

    } catch (error) {
        console.error("Error deleting field:", error);

        res.status(500).json({
            message: "Failed to delete field",
        });
    }
});
module.exports = router;