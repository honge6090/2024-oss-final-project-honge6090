import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AlbumItem from "../components/AlbumItem";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);
  const [token, setToken] = useState("");
  const [addedAlbums, setAddedAlbums] = useState([]);
  const location = useLocation(); // To determine the active page

  useEffect(() => {
    async function fetchToken() {
      const tk = await getSpotifyToken();
      setToken(tk);
    }
    fetchToken();
  }, []);

  useEffect(() => {
    async function fetchAddedAlbums() {
      const response = await fetch(
        "https://6728860f270bd0b97555efb5.mockapi.io/albums"
      );
      const data = await response.json();
      setAddedAlbums(data);
    }
    fetchAddedAlbums();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !token) return;

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=album`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setAlbums(data.albums ? data.albums.items : []);
  };

  const handleAddAlbum = async (album) => {
    const existingAlbumsResponse = await fetch(
      "https://6728860f270bd0b97555efb5.mockapi.io/albums"
    );
    const existingAlbums = await existingAlbumsResponse.json();

    const isDuplicate = existingAlbums.some(
      (storedAlbum) => storedAlbum.spotifyId === album.id
    );
    if (isDuplicate) {
      return;
    }

    const albumToPost = {
      ...album,
      spotifyId: album.id,
      rating: 3,
      genres: [],
    };

    const response = await fetch(
      "https://6728860f270bd0b97555efb5.mockapi.io/albums",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumToPost),
      }
    );

    if (response.ok) {
      const newAlbum = await response.json();
      setAddedAlbums((prev) => [...prev, newAlbum]);
    } else {
      alert("Failed to add album.");
    }
  };

  const handleRemoveAlbum = async (album) => {
    const stored = addedAlbums.find((a) => a.spotifyId === album.id);
    if (!stored) return;

    const response = await fetch(
      `https://6728860f270bd0b97555efb5.mockapi.io/albums/${stored.id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setAddedAlbums((prev) => prev.filter((a) => a.id !== stored.id));
    } else {
      alert("Failed to remove album.");
    }
  };

  const handleToggleAlbum = (album, isAdded) => {
    if (isAdded) {
      handleRemoveAlbum(album);
    } else {
      handleAddAlbum(album);
    }
  };

  const addedIds = new Set(addedAlbums.map((a) => a.spotifyId));

  // Navbar styling
  const headerStyle = {
    backgroundColor: "#111111", // Dark background for the navbar
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

  const searchContainerStyle = {
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "sans-serif",
  };

  const searchInputStyle = {
    padding: "8px",
    width: "200px",
    marginRight: "10px",
  };

  const searchButtonStyle = {
    padding: "8px 12px",
    cursor: "pointer",
  };

  const resultsContainerStyle = {
    margin: "20px auto",
    maxWidth: "70%",
    width: "100%",
    fontFamily: "sans-serif",
  };

  const resultsHeadingStyle = {
    fontSize: "20px",
    marginBottom: "10px",
  };

  const listStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

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
          @media (max-width: 600px) {
            .responsive-container {
              max-width: 100% !important;
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

      <div style={searchContainerStyle}>
        <form onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by album name"
            style={searchInputStyle}
          />
          <button type="submit" style={searchButtonStyle}>
            Search
          </button>
        </form>
      </div>

      {albums.length > 0 && (
        <div style={resultsContainerStyle} className="responsive-container">
          <h2 style={resultsHeadingStyle}>Results</h2>
          <div style={listStyle}>
            {albums.map((album) => {
              const isAdded = addedIds.has(album.id);
              return (
                <AlbumItem
                  key={album.id}
                  album={album}
                  isAdded={isAdded}
                  onToggle={() => handleToggleAlbum(album, isAdded)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Replace this with a real token retrieval method.
async function getSpotifyToken() {
  return process.env.REACT_APP_SPOTIFY_TOKEN;
}

export default SearchPage;
