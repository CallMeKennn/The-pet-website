import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useLocation } from "react-router-dom";

import axiosClient from "../Api/configApi";
import Logout from "../Component/Logout";
import Popup from "reactjs-popup";

import { Button, Table, Form } from "react-bootstrap";

import "../SCSS/PetInfoDetail.scss";

const PetInfoDetail = () => {
    const [visitDate, setVisitDate] = useState("");
    const [commentDoctor, setCommentDoctor] = useState("");
    const [pet, setPet] = useState();
    const [selectDisable, setSelectDisable] = useState(true);
    const [commentDisable, setCommentDisable] = useState(true);
    const [select, setSelect] = useState();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    const idUser = localStorage.getItem("idUser");
    const status = ["alive", "deceased", "other", "missing"];
    let { state } = useLocation();

    useEffect(() => {
        const callApi = async () => {
            try {
                const headers = {
                    authorization: `Bearer ${accessToken}`,
                };

                const petDetail = await axiosClient.get(`/pets/${state.id}`, { headers });
                const petVisits = await axiosClient.get(`/visits`, { headers });

                if (idUser === "0") {
                    const users = await axiosClient.get(`/users`, { headers });

                    setPet(converData(petDetail.data, users.data, petVisits.data));
                    setComment(converData(petDetail.data, users.data, petVisits.data).doctorsComment);
                } else {
                    setPet({
                        ...petDetail.data,
                        visits: petVisits.data.filter((visit) => visit.petId === petDetail.data.id),
                    });
                }

                setLoading(false);
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

        callApi();
    }, []);

    const converData = (pet, users, visits) => {
        const owner = users.find((user) => user.id === pet.ownerId);
        const ownerName = owner ? owner.name : null;
        const petVisits = visits.filter((visit) => visit.petId === pet.id);
        const petDetail = {
            ...pet,
            ownerId: ownerName,
            visits: petVisits,
        };

        return petDetail;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const headers = {
                authorization: `Bearer ${accessToken}`,
            };

            const dataRequest = {
                status: select || pet.status,
                comment: comment,
            };

            const response = await axiosClient.put(`/pets/${state.id}`, dataRequest, { headers });

            alert(response.data.message);

            setPet({ ...response.data.pet, ownerId: pet.ownerId, visits: pet.visits });
            setLoading(false);
        } catch (error) {
            alert("Pet fail updated");
        }
    };

    const handleAddVisit = async () => {
        if (new Date(visitDate) <= new Date() || visitDate === "") {
            alert("Please select a date in the future.");
        } else {
            try {
                const headers = {
                    authorization: `Bearer ${accessToken}`,
                };

                const dataRequest = {
                    petId: state.id,
                    date: visitDate,
                    comment: commentDoctor,
                };
                const responseVisit = await axiosClient.post(`/visits`, dataRequest, { headers });
                console.log(responseVisit)
                setPet((prev) => ({ ...prev, visits: [...prev.visits, responseVisit.data.visit] }));
                setVisitDate("");
                setCommentDoctor("");
                toast.success(responseVisit.data.message, {
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
        }
    };

    return (
        <div className="petdetail-container">
            <div className="petdetail">
                <Logout />
                <div>
                    <div>Pet Name: {pet && pet.name}</div>
                    <div>Date of Birth: {pet && pet.dob}</div>
                    <div className={idUser !== "0" ? "hidden" : ""}>
                        <div>Owner Name: {pet && pet.ownerId}</div>
                    </div>
                    <div>Pet Type: {pet && pet.petType}</div>
                    <div className={idUser !== "0" ? "" : "hidden"}>Status: {pet && pet.status}</div>
                    <div className={idUser !== "0" ? "hidden" : ""}>
                        <div className="status">
                            <Form.Select
                                value={select}
                                onChange={(e) => setSelect(e.target.value)}
                                className="form-select"
                                disabled={selectDisable}
                            >
                                <option value={pet && pet.status}>{pet && pet.status}</option>
                                {status
                                    .filter((status) => status !== (pet && pet.status))
                                    .map((status, index) => (
                                        <option key={index} value={status}>
                                            {status}
                                        </option>
                                    ))}
                            </Form.Select>
                            <Button
                                size="lg"
                                onClick={() => {
                                    setSelectDisable(!selectDisable);
                                }}
                            >
                                Change Status
                            </Button>
                        </div>
                        <h3>Doctor's comments</h3>
                        <div className="comment">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <textarea
                                    className="textarea"
                                    onChange={(e) => setComment(e.target.value)}
                                    value={comment}
                                    disabled={commentDisable}
                                />
                            )}
                            <Button
                                size="lg"
                                onClick={() => {
                                    setCommentDisable(!commentDisable);
                                }}
                            >
                                Change Comment
                            </Button>
                        </div>
                    </div>
                    <h3>Visits</h3>
                    <Table className="table" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pet &&
                                pet.visits.map((visit, index) => (
                                    <tr key={index}>
                                        <td>{visit.date}</td>
                                        <td>{visit.comment}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>

                    <div className="popup__addVisit">
                        <Button
                            size="lg"
                            className={idUser !== "0" ? "hidden" : ""}
                            onClick={handleUpdate}
                            disabled={commentDisable && selectDisable ? true : false}
                        >
                            Update
                        </Button>
                        <ToastContainer position="top-right" autoClose={5000} />;
                        <Popup trigger={<button className="btn-popup button"> Add visit </button>} modal nested>
                            {(close) => (
                                <div>
                                    <button className="btn-popup closee" onClick={close}>
                                        &times;
                                    </button>
                                    <label htmlFor="visitDate">Visit Date:</label>
                                    <input
                                        type="date"
                                        id="visitDate"
                                        value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
                                    />
                                    <div>
                                        <label htmlFor="comment">Comment:</label>
                                        <textarea
                                            id="comment"
                                            value={commentDoctor}
                                            onChange={(e) => setCommentDoctor(e.target.value)}
                                        />
                                    </div>
                                    <div className="btn-add-container">
                                        <Button size="lg" className="btn-popup btn-add" onClick={handleAddVisit}>
                                            Add Visit
                                        </Button>
                                    </div>
                                    <ToastContainer position="top-right" autoClose={5000} />;
                                </div>
                            )}
                        </Popup>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetInfoDetail;
