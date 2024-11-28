import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPage = () => {
  const [formData, setFormData] = useState({
    cname: "",
    prof: "",
    credit: "",
    code: "",
  });
  const navigate = useNavigate();

  const cnameRef = useRef(null);
  const profRef = useRef(null);
  const creditRef = useRef(null);
  const codeRef = useRef(null);

  const validateForm = () => {
    let isValid = true;

    if (!formData.cname.trim()) {
      cnameRef.current.textContent = "Course name is required";
      isValid = false;
    } else {
      cnameRef.current.textContent = "";
    }

    if (!formData.prof.trim()) {
      profRef.current.textContent = "Professor name is required";
      isValid = false;
    } else {
      profRef.current.textContent = "";
    }

    if (!formData.credit.trim()) {
      creditRef.current.textContent = "Credits are required";
      isValid = false;
    } else {
      creditRef.current.textContent = "";
    }

    if (!formData.code.trim()) {
      codeRef.current.textContent = "Course code is required";
      isValid = false;
    } else {
      codeRef.current.textContent = "";
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        "https://6728860f270bd0b97555efb5.mockapi.io/courses",
        formData
      );
      navigate("/");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Add New Course</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary btn-block mt-3">
          Add Course
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block mt-2"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPage;
