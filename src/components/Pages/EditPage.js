import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cname: "",
    prof: "",
    credit: "",
    code: "",
  });
  const [changeCount, setChangeCount] = useState(0);

  const cnameRef = useRef(null);
  const profRef = useRef(null);
  const creditRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `https://6728860f270bd0b97555efb5.mockapi.io/courses/${id}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const validateField = (name, value) => {
    let errorMessage = "";
    if (!value.trim()) {
      errorMessage = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    }

    switch (name) {
      case "cname":
        cnameRef.current.textContent = errorMessage;
        break;
      case "prof":
        profRef.current.textContent = errorMessage;
        break;
      case "credit":
        creditRef.current.textContent = errorMessage;
        break;
      case "code":
        codeRef.current.textContent = errorMessage;
        break;
      default:
        break;
    }
    return !errorMessage;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (!validateField(name, value)) return;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    try {
      await axios.put(
        `https://6728860f270bd0b97555efb5.mockapi.io/courses/${id}`,
        { ...formData, [name]: value }
      );

      setChangeCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Edit Course</h1>
      <p>Total Changes Made: {changeCount}</p>
      <form>
        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="cname"
            className="form-control"
            value={formData.cname}
            onChange={handleChange}
          />
          <small className="text-danger" ref={cnameRef}></small>
        </div>
        <div className="form-group">
          <label>Professor</label>
          <input
            type="text"
            name="prof"
            className="form-control"
            value={formData.prof}
            onChange={handleChange}
          />
          <small className="text-danger" ref={profRef}></small>
        </div>
        <div className="form-group">
          <label>Credits</label>
          <input
            type="text"
            name="credit"
            className="form-control"
            value={formData.credit}
            onChange={handleChange}
          />
          <small className="text-danger" ref={creditRef}></small>
        </div>
        <div className="form-group">
          <label>Course Code</label>
          <input
            type="text"
            name="code"
            className="form-control"
            value={formData.code}
            onChange={handleChange}
          />
          <small className="text-danger" ref={codeRef}></small>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-block mt-3"
          onClick={() => navigate("/")}
        >
          Back to List
        </button>
      </form>
    </div>
  );
};

export default EditPage;
