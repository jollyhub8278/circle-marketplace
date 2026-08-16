# Circle Marketplace

A full-stack marketplace application built with React, Node.js, Express, and PostgreSQL.

The application provides a dynamic product listing system where administrators can create categories and configure reusable listing fields for each category. Sellers then see the appropriate fields dynamically based on the category they select.

## Demo

**Live Demo:**  
(https://circle-marketplace-rfku.vercel.app/)

---

## Features

### Seller Experience

- View recently listed products
- View product details
- Create a new product listing
- Select a product category
- Dynamically load category-specific fields
- Submit product listings
- Support different field types
- Required and optional fields
- Conditional fields
- Numeric field constraints such as minimum and maximum values

### Admin Experience

- Create categories
- Edit categories
- Delete categories
- Create listing fields
- Edit listing fields
- Delete listing fields
- Configure field types
- Configure required/optional fields
- Configure placeholders
- Configure minimum and maximum values
- Configure options for select/radio fields
- Configure conditional fields
- Assign fields to categories
- Remove fields from categories
- Reorder fields within a category

---

## Architecture

The application follows a simple three-tier architecture:

```text
                    User
                      |
                      v
              React + Vite
                 Frontend
                      |
                  REST API
                      |
                      v
              Node.js + Express
                  Backend
                      |
                PostgreSQL
                      |
                      v
                Neon Database
````

### Frontend

The frontend is built using:

* React
* Vite
* JavaScript
* CSS
* React Hooks
* Fetch API

The frontend handles the user interface, seller listing form, dynamic field rendering, admin dashboard, product listing, and product details.

### Backend

The backend is built using:

* Node.js
* Express.js
* PostgreSQL
* `pg`

The backend provides REST APIs for categories, fields, category-field relationships, and product listings.

### Database

PostgreSQL is hosted using Neon.

The main database tables are:

* `categories`
* `fields`
* `category_fields`
* `listings`
* `listing_field_values`

---

## Dynamic Field System

The main design goal of the application is to make the seller listing form database driven instead of hardcoding fields for every category.

Administrators can create reusable fields such as:

```text
Field Name: battery_health
Label: Battery Health
Type: Number
Required: No
Minimum: 0
Maximum: 100
```

The field can then be assigned to a category.

When a seller selects that category, the frontend fetches the fields assigned to that category and dynamically renders them in the listing form.

For example:

```text
Category: Mobile Phone

Title
Description
Price
Condition
Brand
Model
Storage
RAM
Battery Health
```

This means that adding a new field or category does not require modifying the seller form's structure.

---

## Conditional Fields

The application supports conditional fields.

A field can depend on another field and only appear when a specific value is selected.

For example:

```text
Product Type: Camera

Lens Mount
```

The `Lens Mount` field can be configured to appear only when:

```text
Product Type = Camera
```

The frontend evaluates the configured condition and displays the field dynamically.

---

## Database Design

### Categories

The `categories` table stores marketplace categories.

```text
id
name
slug
created_at
updated_at
```

### Fields

The `fields` table stores reusable listing field definitions.

```text
id
name
label
field_type
required
placeholder
default_value
min_value
max_value
min_length
max_length
options
conditional_on_field_id
conditional_on_value
created_at
updated_at
```

### Category Fields

The `category_fields` table connects categories with their fields.

```text
id
category_id
field_id
display_order
```

This allows a field to be reused across multiple categories and allows the order of fields to be configured independently for each category.

### Listings

The `listings` table stores the common information for each product.

```text
id
category_id
title
description
price
condition
images
created_at
updated_at
```

### Listing Field Values

The `listing_field_values` table stores values entered for dynamic fields.

```text
id
listing_id
field_id
value
```

This approach keeps the listing schema flexible because new category-specific fields can be added without modifying the `listings` table.

---

## API Endpoints

### Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Fields

```text
GET    /api/fields
POST   /api/fields
PUT    /api/fields/:id
DELETE /api/fields/:id
```

### Category Fields

```text
GET    /api/categories/:categoryId/fields

POST   /api/categories/:categoryId/fields

DELETE /api/categories/:categoryId/fields/:fieldId

PUT    /api/categories/:categoryId/fields/:fieldId/order
```

### Listings

```text
GET    /api/listings
GET    /api/listings/:id
POST   /api/listings
```

### Health Check

```text
GET    /api/health
```

---

## Project Structure

```text
circle-marketplace/
│
├── backend/
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── fieldRoutes.js
│   │   └── listingRoutes.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
│
├── src/
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   └── SellProduct.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Local Setup

### Prerequisites

* Node.js
* npm
* PostgreSQL database or Neon PostgreSQL database

### 1. Clone the repository

```bash
git clone PASTE_YOUR_GITHUB_REPOSITORY_URL_HERE

cd circle-marketplace
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL=YOUR_POSTGRESQL_CONNECTION_STRING
PORT=5000
```

Environment files should not be committed to Git.

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal from the project root:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## Production Deployment

The application is deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → Neon PostgreSQL
```

The production frontend communicates with the deployed backend through the `VITE_API_URL` environment variable.

The backend connects to the production Neon PostgreSQL database using the `DATABASE_URL` environment variable.

---

## Sample Data

The application includes sample data for testing the marketplace functionality.

The sample data includes:

* Product categories
* Listing fields
* Category-field mappings
* Product listings
* Dynamic listing field values

The database can be populated using the provided SQL dump/sample SQL file.

---

## Testing

The following functionality was tested:

### Seller

* Category selection
* Dynamic field loading
* Required fields
* Optional fields
* Different field types
* Conditional fields
* Numeric constraints
* Listing creation
* Listing persistence
* Product details
* Recently listed products

### Admin

* Category creation
* Category editing
* Category deletion
* Field creation
* Field editing
* Field deletion
* Assigning fields to categories
* Removing fields from categories
* Reordering category fields
* Conditional field configuration

### Backend

* API endpoints
* PostgreSQL connectivity
* Data persistence
* Category-field relationships
* Listing creation
* Dynamic field value storage

---

## Design Decisions

### Database-driven listing fields

Listing fields are stored in the database instead of being hardcoded in the frontend.

This allows administrators to modify the listing form without changing application code.

### Reusable fields

Fields are separated from categories and connected through the `category_fields` table.

This allows the same field to be reused across multiple categories.

### Dynamic listing values

Category-specific values are stored in `listing_field_values`.

This avoids adding new columns to the `listings` table whenever a new field is created.

### Field ordering

Each category-field relationship contains a `display_order` value.

This allows administrators to control the order in which fields appear in the seller form.

### Conditional fields

Conditional relationships are stored using:

```text
conditional_on_field_id
conditional_on_value
```

The frontend uses these values to determine whether a field should be displayed.

### REST API

The frontend and backend communicate through REST APIs.

This keeps the frontend and backend separated and independently deployable.

---

## Environment Variables

The application uses environment variables for configuration.

Frontend:

```env
VITE_API_URL=
```

Backend:

```env
DATABASE_URL=
PORT=
```

Sensitive environment files are excluded from version control using `.gitignore`.

---

## Future Improvements

Possible future improvements include:

* Authentication and authorization
* Role-based access control
* Image upload and cloud storage
* Search and filtering
* Pagination
* Edit and delete listings
* User profiles
* Wishlist/favorites
* Buyer-seller messaging
* Improved form validation
* Production monitoring and logging

````

### Before you commit

Only change these:

**1.**
```md
PASTE_YOUR_VERCEL_URL_HERE
````

→ your actual Vercel demo URL.

**2.**

```md
PASTE_YOUR_GITHUB_REPOSITORY_URL_HERE
```

→ your actual GitHub repo URL.

And in the clone command, use the same GitHub URL.

Then run:

```bash
git add README.md
git commit -m "Add project documentation"
git push origin main
```

One thing I **wouldn't** add to the README: your Neon `DATABASE_URL`, passwords, or any actual `.env` contents. Those stay private.
