import { Card } from "react-bootstrap";
import "./TransactionHistoryCard.scss";
import buyerArrow from "../../assets/images/arrow-up-left.png";
import sellerArrow from "../../assets/images/arrow-bottom-right.png";
import { ethers } from "ethers";
import { BsFillArrowDownRightCircleFill, BsFillArrowUpLeftCircleFill, BsArrowDownRight, BsArrowUpLeft } from 'react-icons/bs'
const TransactionHistoryMiniCard = (props) => {

  return (
    <Card
      className={`th-mini-card ${props.selected === "true" ? "selected" : ""}`} onClick={() => {
        props.handleCardClick(props);
      }}
    >
      <div className="row">
        <div className="col-3 arrow-container">
          {props.role == "buyer" && (
            <BsFillArrowDownRightCircleFill size={40} color="black"/>
          )}
          {props.role == "seller" && (
            <BsFillArrowUpLeftCircleFill size={40} color="black"/>
          )}
        </div>
        <div className="col-9 text-box row row-cols-2">
          <h4 className="invoice-id col">{props.invoiceID}</h4>
          {props.status == "paid" && (
            <h4 className="status col badge rounded-pill bg-success">Paid</h4>
          )}
          {props.status == "pending" && (
            <h4 className="status col badge rounded-pill bg-danger">Pending</h4>
          )}
          <h4 className="partner-pan col">{props.partnerPAN}</h4>
          <h4 className="amount col">{props.amount}</h4>
        </div>
      </div>
    </Card>
  );
};

export default TransactionHistoryMiniCard;
