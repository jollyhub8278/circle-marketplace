import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/listings/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Listing not found");
        }

        return response.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!listing) {
    return <p>Listing not found.</p>;
  }

  return (
    <div>
      <h1>{listing.title}</h1>

      <p>
        <strong>Category:</strong> {listing.category}
      </p>

      <h2>₹{listing.price}</h2>

      <p>
        <strong>Condition:</strong> {listing.condition}
      </p>

      <h3>Description</h3>

      <p>{listing.description}</p>

      <hr />

      <h2>Product Details</h2>

      {listing.fields.map((field) => (
        <div key={field.id}>
          <strong>{field.label}:</strong>{" "}
          {field.value}
        </div>
      ))}
    </div>
  );
}

export default ProductDetail;