import React from "react";
import { useNavigate } from "react-router-dom";
import "../SCSS/Logout.scss";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';



const Logout = () => {
    let navigate = useNavigate();
    const idUser = localStorage.getItem("idUser");

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idUser');
        navigate("/");
    };

    return (
        <div className="group">
            <h1>Hello {idUser === "0" ? "Doctor" : "User"}</h1>
            <Button variant="primary" size="lg" onClick={handleLogout}>
                Log Out
            </Button>
        </div>
    );
};

export default Logout;
