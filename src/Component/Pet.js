import React from "react";
import { Link } from "react-router-dom";
import "../SCSS/Pet.scss"
import { faCat, faDog } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pet = ({ name, petType, id }) => {
    return (
        <Link to="/petdetail" state={{id: id}} className="link">
            <div className={`${petType === "dog" ? "dog" : "cat"} pet`}>
                {petType === "dog" ? <FontAwesomeIcon icon={faDog} size="4x"/> : <FontAwesomeIcon icon={faCat} size="4x"/>}
                <h1>{name}</h1>
                <div>{petType}</div>
            </div>
        </Link>
    );
};

export default Pet;
