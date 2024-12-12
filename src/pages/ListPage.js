import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function ListPage() {
  const [albums, setAlbums] = useState([]);
  const [hoveredAlbum, setHoveredAlbum] = useState(null); // Track which album is hovered
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState("All");
  const location = useLocation();

  useEffect(() => {
    async function fetchAlbums() {
      const response = await fetch(
        "https://6728860f270bd0b97555efb5.mockapi.io/albums"
      );
      const data = await response.json();
      setAlbums(data);
    }
    fetchAlbums();
  }, []);

  const headerStyle = {
    backgroundColor: "#111111",
    color: "#fff",
    padding: "20px",
    fontWeight: "bold",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "20px",
    fontFamily: "sans-serif",
  };

  const navLinkStyle = {
    color: "#AEAEAE",
    textDecoration: "none",
    fontSize: "16px",
    fontFamily: "sans-serif",
  };

  const activeNavLinkStyle = {
    color: "#fff",
  };

  const filterContainerStyle = {
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "sans-serif",
  };

  const inputStyle = {
    padding: "8px",
    marginRight: "10px",
  };

  const filteredAlbums = albums.filter((album) => {
    const searchMatch = album.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const minRatingValue = minRating === "All" ? 0 : Number(minRating);
    const ratingMatch = (album.rating || 0) >= minRatingValue;
    return searchMatch && ratingMatch;
  });

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    padding: "20px",
    margin: "0 auto",
    maxWidth: "95%",
    width: "100%",
  };

  const albumContainerStyle = {
    position: "relative",
    overflow: "hidden",
    height: "210px",
    cursor: "pointer",
  };

  const albumImageStyle = (isHovered) => ({
    width: "100%",
    position: "absolute",
    opacity: isHovered ? 0.5 : 1, // dim only the hovered image
    top: "-45%",
    transition: "opacity 0.3s ease",
  });

  const albumOverlayStyle = (isHovered) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: isHovered ? 1 : 0, // show overlay only on hover
    transition: "opacity 0.3s ease",
    fontSize: "14px",
    fontFamily: "sans-serif",
    textAlign: "center",
  });

  const pageStyle = {
    backgroundColor: "#111111",
    color: "#fff",
    fontFamily: "sans-serif",
    minHeight: "100vh",
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          a:hover {
            color: #fff !important;
          }
          @media (max-width: 768px) {
            .responsive-container {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .responsive-container {
              grid-template-columns: repeat(1, 1fr) !important;
            }
          }
        `}
      </style>

      {/* Navbar */}
      <div style={headerStyle}>
        <div>Music Search</div>
        <Link
          to="/"
          style={{
            ...navLinkStyle,
            ...(location.pathname === "/" ? activeNavLinkStyle : {}),
          }}
        >
          Search
        </Link>
        <Link
          to="/list"
          style={{
            ...navLinkStyle,
            ...(location.pathname === "/list" ? activeNavLinkStyle : {}),
          }}
        >
          My Albums
        </Link>
      </div>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search Album"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          style={inputStyle}
        >
          <option value="All">All Ratings</option>
          <option value="1">1 and up</option>
          <option value="2">2 and up</option>
          <option value="3">3 and up</option>
          <option value="4">4 and up</option>
          <option value="5">5 only</option>
        </select>
      </div>

      <div style={gridContainerStyle} className="responsive-container">
        {filteredAlbums.length === 0 ? (
          <p>No albums match your search.</p>
        ) : (
          filteredAlbums.map((album) => {
            const albumCover =
              album.images && album.images.length > 0
                ? album.images[0].url
                : null;

            const artistNames =
              album.artists && album.artists.length > 0
                ? album.artists.map((artist) => artist.name).join(", ")
                : "Unknown Artist";

            const isHovered = hoveredAlbum === album.id;

            return (
              albumCover && (
                <Link to={`/albums/${album.id}`} key={album.id}>
                  <div
                    style={albumContainerStyle}
                    onMouseEnter={() => setHoveredAlbum(album.id)}
                    onMouseLeave={() => setHoveredAlbum(null)}
                  >
                    <img
                      src={albumCover}
                      alt={album.name}
                      style={albumImageStyle(isHovered)}
                    />
                    <div style={albumOverlayStyle(isHovered)}>
                      {`${album.name} | ${artistNames}`}
                    </div>
                  </div>
                </Link>
              )
            );
          })
        )}
      </div>
    </div>
  );
}

export default ListPage;
