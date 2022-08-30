import React, { useState, useEffect } from "react";
import "./sponsor.css";
import { ToastContainer, toast } from "react-toastify";

import footer from "./footer.png";

function Sponsor() {
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="sponsors">SPONSORS</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <img className="sponsor-image" src={footer} alt="sposor" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sponsor;
