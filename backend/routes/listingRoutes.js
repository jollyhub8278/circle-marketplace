const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      categoryId,
      title,
      description,
      price,
      condition,
      fieldValues,
    } = req.body;

    // Basic validation
    if (!categoryId || !title || !price) {
      return res.status(400).json({
        message: "Category, title and price are required",
      });
    }

    // Start transaction
    await client.query("BEGIN");

    // Create listing
    const listingResult = await client.query(
      `
      INSERT INTO listings
        (category_id, title, description, price, condition)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        categoryId,
        title,
        description || null,
        price,
        condition || null,
      ]
    );

    const listing = listingResult.rows[0];

    // Save dynamic field values
    if (fieldValues) {
      for (const [fieldName, value] of Object.entries(fieldValues)) {
        // Find field ID from field name
        const fieldResult = await client.query(
          `SELECT id FROM fields WHERE name = $1`,
          [fieldName]
        );

        if (fieldResult.rows.length === 0) {
          continue;
        }

        const fieldId = fieldResult.rows[0].id;

        await client.query(
          `
          INSERT INTO listing_field_values
            (listing_id, field_id, value)
          VALUES
            ($1, $2, $3)
          `,
          [
            listing.id,
            fieldId,
            String(value),
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error creating listing:", error);

    res.status(500).json({
      message: "Failed to create listing",
    });

  } finally {
    client.release();
  }
});

// GET all listings
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        l.id,
        l.title,
        l.description,
        l.price,
        l.condition,
        l.images,
        l.created_at,
        c.name AS category
      FROM listings l
      JOIN categories c
        ON l.category_id = c.id
      ORDER BY l.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching listings:", error);

    res.status(500).json({
      message: "Failed to fetch listings",
    });
  }
});

// GET a single listing with category-specific fields
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const listingResult = await pool.query(
      `
      SELECT
        l.id,
        l.title,
        l.description,
        l.price,
        l.condition,
        l.images,
        l.created_at,
        c.id AS category_id,
        c.name AS category
      FROM listings l
      JOIN categories c
        ON l.category_id = c.id
      WHERE l.id = $1
      `,
      [id]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const listing = listingResult.rows[0];

    const fieldsResult = await pool.query(
      `
      SELECT
        f.id,
        f.name,
        f.label,
        f.field_type,
        lfv.value
      FROM listing_field_values lfv
      JOIN fields f
        ON lfv.field_id = f.id
      WHERE lfv.listing_id = $1
      ORDER BY f.id
      `,
      [id]
    );

    listing.fields = fieldsResult.rows;

    res.json(listing);

  } catch (error) {
    console.error("Error fetching listing:", error);

    res.status(500).json({
      message: "Failed to fetch listing",
    });
  }
});

module.exports = router;