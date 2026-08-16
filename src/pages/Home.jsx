import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const API_URL = import.meta.env.VITE_API_URL;
function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/listings`)
      .then((response) => response.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        setLoading(false);
      });
  }, []);

  const filteredListings = listings.filter((listing) =>
    listing.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">

        <Link to="/" className="logo">
          Circle
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/sell">Sell</Link>
          <Link to="/admin">Admin</Link>
        </div>

      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            SECONDHAND MARKETPLACE
          </p>

          <h1>
            Give great products
            <br />
            a second life.
          </h1>

          <p className="hero-description">
            Buy and sell pre-loved products
            from people around you.
          </p>

          <Link to="/sell" className="sell-button">
            Sell a Product
          </Link>

        </div>

      </section>

      {/* SEARCH */}
      <section className="search-section">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </section>

      {/* LISTINGS */}
      <section className="listings-section">

        <div className="section-header">

          <div>
            <p className="section-label">
              MARKETPLACE
            </p>

            <h2>
              Recently Listed
            </h2>
          </div>

          <span className="listing-count">
            {filteredListings.length} listings
          </span>

        </div>

        {loading ? (
          <p className="status">
            Loading listings...
          </p>
        ) : filteredListings.length === 0 ? (
          <div className="empty-state">

            <h3>
              No listings found
            </h3>

            <p>
              Be the first person to list
              something.
            </p>

            <Link
              to="/sell"
              className="empty-button"
            >
              Create Listing
            </Link>

          </div>
        ) : (

          <div className="product-grid">

            {filteredListings.map((listing) => (

              <div
                className="product-card"
                key={listing.id}
              >

                <div className="product-image">
                  <span>
                    {listing.category}
                  </span>
                </div>

                <div className="product-info">

                  <p className="product-category">
                    {listing.category}
                  </p>

                  <h3>
                    {listing.title}
                  </h3>

                  <p className="product-condition">
                    {listing.condition}
                  </p>

                  <div className="product-bottom">

                    <strong>
                      ₹
                      {Number(listing.price).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <Link
                      to={`/listing/${listing.id}`}
                      className="details-button"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer>
        <p>
          © 2026 Circle Marketplace
        </p>

        <p>
          Buy better. Sell smarter.
        </p>
      </footer>

    </div>
  );
}

export default Home;