import React from "react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast, Bounce } from "react-toastify";
import { Container, Form, InputGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import axiosClient from "../Api/configApi";
import Logout from "../Component/Logout";

import "react-toastify/dist/ReactToastify.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../SCSS/DoctorPage.scss";

const DoctorPage = () => {
    const [data, setData] = useState(null);
    const [text, setText] = useState("");
    const [typeValue, setTypeValue] = useState([]);
    const [statusValue, setStatusValue] = useState("All");
   
    const token = localStorage.getItem("accessToken");

    const addLatestDateToPets = (pets, visits) => {
        const latestDates = {};
        visits.forEach((visit) => {
            const { petId, date } = visit;
            if (!latestDates[petId] || new Date(date) > new Date(latestDates[petId])) {
                latestDates[petId] = date;
            }
        });
        const petsWithDates = pets.map((pet) => ({
            ...pet,
            latestVisitDate: latestDates[pet.id] || null,
        }));
        console.log(petsWithDates);
        return petsWithDates;
    };

    const handleChangeCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setTypeValue((prev) => [...prev, value]);
        } else {
            setTypeValue((prev) => [...removeElement(prev, value)]);
        }
    };

    const removeElement = (array, elem) => {
        var index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    };

    useEffect(() => {
        
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

        

        const getDataListPet = async () => {
            const headers = {
                authorization: `Bearer ${token}`,
            };

            try {
                const responsePets = await axiosClient.get(`/pets`, { headers });
                const responseUsers = await axiosClient.get(`/users`, { headers });
                const responseVisits = await axiosClient.get(`/visits`, { headers });

                const data = responsePets.data.map((pet) => {
                    const ownerId = pet.ownerId;
                    return { ...pet, ownerId: responseUsers.data[ownerId - 1].name };
                });

                setData(addLatestDateToPets(data, responseVisits.data));
            } catch (error) {
                toast.error(error.response.data, {
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

        getDataListPet();
    }, []);

    return (
        <div className="doctor-container">
            <Logout />
            <ToastContainer autoClose={5000} position="top-right" />

            <Container className="container">
                <div className="container__filter">
                    <h1 className="text-center mt-4">Filter Pets</h1>
                    <Form>
                        <InputGroup size="lg" className="my-3">
                            <Form.Control
                                value={text}
                                placeholder="Search pets"
                                onChange={(e) => setText(e.target.value)}
                            />
                        </InputGroup>
                    </Form>

                    <div>
                        <div>
                            <h5>Select by Type pet</h5>
                            <Form>
                                <Form.Check
                                    onChange={handleChangeCheckbox}
                                    value="dog"
                                    inline
                                    name="petType"
                                    type="checkbox"
                                    label="Dog"
                                />
                                <Form.Check
                                    onChange={handleChangeCheckbox}
                                    value="cat"
                                    inline
                                    name="petType"
                                    type="checkbox"
                                    label="Cat"
                                />
                            </Form>
                        </div>

                        <div>
                            <h5>Select by Status</h5>
                            <Form>
                                <Form.Check
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    checked={statusValue === "Alive"}
                                    value="Alive"
                                    inline
                                    name="status"
                                    type="radio"
                                    label="Alive"
                                />
                                <Form.Check
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    checked={statusValue === "Deceased"}
                                    value="Deceased"
                                    inline
                                    name="status"
                                    type="radio"
                                    label="Deceased"
                                />
                                <Form.Check
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    checked={statusValue === "All"}
                                    value="All"
                                    inline
                                    name="status"
                                    type="radio"
                                    label="All"
                                />
                            </Form>
                        </div>
                    </div>
                </div>

                {data && (
                    <div className="container__listPet">
                        <h1 className="text-center mt-4">List Pets</h1>
                        <Table striped bordered hover >
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Name</th>
                                    <th>Pet Type</th>
                                    <th>Owner Name</th>
                                    <th>Date of birth</th>
                                    <th>Last date vistit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data
                                    .filter((pet) => {
                                        const searchByText =
                                            pet.name.toLowerCase().includes(text) ||
                                            pet.ownerId.toLowerCase().includes(text) ||
                                            pet.dob.toLowerCase().includes(text);

                                        if (statusValue === "All") {
                                            return typeValue.length
                                                ? searchByText && typeValue.includes(pet.petType)
                                                : searchByText;
                                        }

                                        return (
                                            searchByText &&
                                            (statusValue === "Alive"
                                                ? pet.status === "alive"
                                                : pet.status !== "alive") &&
                                            (typeValue.length ? typeValue.includes(pet.petType) : true)
                                        );
                                    })
                                    .map((pet, index) => (
                                        <tr key={pet.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Link className="link" state={{ id: pet.id }} to="/petdetail">
                                                    {pet.name}
                                                </Link>
                                            </td>
                                            <td>{pet.petType}</td>
                                            <td>{pet.ownerId}</td>
                                            <td>{pet.dob}</td>
                                            <td>{pet.latestVisitDate}</td>
                                            <td
                                                className={`${
                                                    pet.status === "alive"
                                                        ? "alive"
                                                        : pet.status === "deceased"
                                                        ? "deceased"
                                                        : "missing"
                                                }`}
                                            >
                                                {pet.status}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default DoctorPage;
