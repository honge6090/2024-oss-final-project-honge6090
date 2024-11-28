import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DetailPage = () => {
  const { id } = useParams(); // get crs id
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `https://6728860f270bd0b97555efb5.mockapi.io/courses/${id}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Course Details</h1>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{course.cname}</h3>
          <p className="card-text">
            <strong>Professor:</strong> {course.prof}
          </p>
          <p className="card-text">
            <strong>Credits:</strong> {course.credit}
          </p>
          <p className="card-text">
            <strong>Course Code:</strong> {course.code}
          </p>
        </div>
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
        Back to List
      </button>
    </div>
  );
};

export default DetailPage;
