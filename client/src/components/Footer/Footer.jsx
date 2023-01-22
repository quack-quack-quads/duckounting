import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter className="bg-dark text-center text-white">
      <MDBContainer className="p-4">
        <MDBCol>
          <h5 className="text-uppercase">Attributions</h5>
          <ul className="list-unstyled mb-0">
            <li>
              <a
                style={{ "text-decoration": "none", color: "white" }}
                href="https://www.flaticon.com/free-icons/blockchain"
                title="blockchain icons"
              >
                Blockchain icons created by Freepik - Flaticon
              </a>
            </li>
            <li>
              <a
                style={{ "text-decoration": "none", color: "white" }}
                href="https://www.flaticon.com/free-animated-icons/blockchain"
                title="blockchain animated icons"
              >
                Blockchain animated icons created by Freepik - Flaticon
              </a>
            </li>
            <li>
              <a
                style={{ "text-decoration": "none", color: "white" }}
                href="https://www.flaticon.com/free-icons/nft"
                title="nft icons"
              >
                Nft icons created by Flowicon - Flaticon
              </a>
            </li>
            <li>
              <a
                style={{ "text-decoration": "none", color: "white" }}
                href="https://www.flaticon.com/free-icons/duck"
                title="duck icons"
              >
                Duck icons created by pongsakornRed - Flaticon
              </a>
            </li>
          </ul>
        </MDBCol>
      </MDBContainer>
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2023 Copyright: Duckounting
      </div>
    </MDBFooter>
  );
}
