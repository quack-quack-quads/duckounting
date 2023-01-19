import { Card } from "react-bootstrap";
import "./TransactionHistoryCard.scss";
import buyerArrow from "../../assets/images/arrow-up-left.png";
import sellerArrow from "../../assets/images/arrow-bottom-right.png";

const TransactionHistoryMiniCard = (props) => {
  return (
    <Card
      className={`th-mini-card ${props.selected === "true" ? "selected" : ""}`}
    >
      <div className="row">
        <div className="col-3 arrow-container">
          {props.role == "buyer" && (
            <img src={buyerArrow} className="role-arrow" />
          )}
          {props.role == "seller" && (
            <img src={sellerArrow} className="role-arrow" />
          )}
        </div>
        <div className="col-9 text-box row row-cols-2">
          <h4 className="invoice-id col">{props.invoiceID}</h4>
          {props.status == "done" && (
            <h4 className="status col badge rounded-pill bg-success">Done</h4>
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
