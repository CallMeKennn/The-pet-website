import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";

import axiosClient from "../Api/configApi";
import Logout from "../Component/Logout";
import Pet from "../Component/Pet";
import Popup from "reactjs-popup";

import "../SCSS/UserPage.scss";
import "reactjs-popup/dist/index.css";

const UserPage = () => {
    const [petList, setPetList] = useState([]);
    const [petName, setPetName] = useState("");
    const [petDate, setPetDate] = useState("");
    const [petType, setPetType] = useState("");

    const accessToken = localStorage.getItem("accessToken");
    const idUser = localStorage.getItem("idUser");

    const handleAddPet = async () => {
        try {
            const headers = {
                authorization: `Bearer ${accessToken}`,
            };

            const dataCreatePet = {
                name: petName !== "" ? petName : undefined,
                petType: petType !== "" ? petType : undefined,
                dob: petDate !== "" ? petDate : undefined,
                ownerId: Number(idUser),
            };

            const addPet = await axiosClient.post(`/pets`, dataCreatePet, { headers });

            setPetList((prev) => [...prev, addPet.data.pet]);
            setPetName("");
            setPetDate("");
            setPetType("");

            alert(addPet.data.message);
        } catch (error) {
            toast.error(error.response.data.error, {
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
        }
    };

    useEffect(() => {
        const callAPI = async () => {
            toast.success("Login successful", {
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

            try {
                const headers = {
                    authorization: `Bearer ${accessToken}`,
                };

                const responsePets = await axiosClient.get(`/pets`, { headers });
                setPetList(responsePets.data);
            } catch (error) {
                toast.error(error.response.data.error, {
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
            }
        };

        callAPI();
    }, []);

    return (
        <div className="userpage">
            <Logout />

            <div className="pet-container-parent">
                <div className="pets-container">
                    {petList.map((pet, index) => (
                        <Pet key={index} {...pet} />
                    ))}
                </div>

                <Popup
                    trigger={
                        <div className="pet">
                            <button>+</button>
                        </div>
                    }
                    modal
                    nested
                >
                    {(close) => (
                        <div className="popup-create">
                            <button className="btn-popup closee" onClick={close}>
                                &times;
                            </button>
                            <label htmlFor="petName">Pet Name:</label>
                            <input
                                placeholder="Input Pet Name ...."
                                required
                                type="text"
                                id="petName"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                            />

                            <label htmlFor="petDate">Pet Date:</label>
                            <input
                                placeholder="Input Date Of Birth ...."
                                required
                                type="date"
                                id="petDate"
                                value={petDate}
                                onChange={(e) => setPetDate(e.target.value)}
                            />

                            <label htmlFor="petType">Pet Type:</label>
                            <input
                                placeholder="Input Pet Type...."
                                required
                                type="text"
                                id="petType"
                                value={petType}
                                onChange={(e) => setPetType(e.target.value)}
                            />

                            <div className="btn-create-pet">
                                <button onClick={handleAddPet}>Add Pet</button>
                            </div>

                            <ToastContainer position="top-right" autoClose={5000} />
                        </div>
                    )}
                </Popup>
            </div>

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default UserPage;
