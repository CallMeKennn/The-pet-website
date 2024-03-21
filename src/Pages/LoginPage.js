import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axiosClient from "../Api/configApi";
import "../SCSS/LoginPage.scss";
import Logo from "../Assets/logo.png";
import petImage from "../Assets/petImage.png";

const LoginPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        console.log(123);
        axiosClient
            .post("/login", {
                email,
                password,
            })
            .then((response) => {
                setIsLoggedIn(true);
                let url = response.data.id === 0 ? "/doctor" : "/user";
                localStorage.setItem("accessToken", response.data.access_token);
                localStorage.setItem("idUser", response.data.id);

                navigate(url);
            })
            .catch((err) => {
                setIsLoggedIn(false);
                toast.error(err.response.data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            });
    };

    return (
        <div className="login-container">
            <div className="login">
                <form className="form" onSubmit={handleLogin}>
                    <div className="logo-parent">
                        <img src={Logo} alt={Logo} />
                    </div>
                    <h2>Sign In to continue</h2>
                    <div>
                        <input
                            placeholder="Email:"
                            className="email-input"
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Password:"
                            className="password-input"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button className="btn-login" type="submit">
                        Login
                    </button>
                </form>

                <div className="petImage">
                    <img src={petImage} alt={petImage} />
                </div>

                {isLoggedIn || <ToastContainer autoClose={5000} position="top-right" />}
            </div>
        </div>
    );
};

export default LoginPage;
