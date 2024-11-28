import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://6728860f270bd0b97555efb5.mockapi.io/courses"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleNameClick = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://6728860f270bd0b97555efb5.mockapi.io/courses/${id}`
      );
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Course Management</h1>

      <button className="btn btn-primary mb-3" onClick={() => navigate("/add")}>
        Add New Course
      </button>

      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => handleNameClick(item.id)}
              >
                {item.cname}
              </strong>
              {" - " + item.prof + " - " + item.credit + " Credits - Code: "}
              {item.code}
            </div>
            <div>
              <button
                className="btn btn-sm btn-primary mr-2"
                onClick={() => navigate(`/update/${item.id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
