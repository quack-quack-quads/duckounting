import { Card } from "react-bootstrap";
import buyerArrow from "../../assets/images/arrow-up-left.png";
import sellerArrow from "../../assets/images/arrow-bottom-right.png";
import "./TransactionHistoryCard.scss";
import {BsFillArrowDownRightCircleFill, BsFillArrowUpLeftCircleFill, BsArrowDownRight, BsArrowUpLeft} from 'react-icons/bs'
const TransactionHistoryCard = (props) => {
  
  return (
    <Card className="th-card" onClick={props.handleCardClick} >
      <div className="row">
        <div className="col-2 arrow-container">
          {props.role == "buyer" && (
            <BsFillArrowDownRightCircleFill size={40}/>
          )}
          {props.role == "seller" && (
            <BsFillArrowUpLeftCircleFill size={40}/>
          )}
        </div>
        <div className="col-10 row row-cols-4 text-box">
          <h4 className="invoice-id col-6">{props.invoiceID}</h4>
          <h4 className="date col">{props.date}</h4>
          {props.status == "paid" && (
            <h4 className="status col badge rounded-pill bg-success">Paid</h4>
          )}
          {props.status == "pending" && (
            <h4 className="status col badge rounded-pill bg-danger">Pending</h4>
          )}
          <h4 className="partner-pan col-6">{props.partnerPAN}</h4>
          <h4 className="mode col">{props.mode}</h4>
          <h4 className="amount col">{props.amount}</h4>
        </div>
      </div>
    </Card>
  );
};

export default TransactionHistoryCard;
