import { useState } from "react";
import "./PendingTransaction.scss";
import { FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import SortButton from "../TransactionHistory/SortButton";

const PendingTransactionHeader = (props) => {
  const [sortOrder, setSortOrder] = useState(["date", "dec"]);
  const [filterState, setFilterState] = useState([false, false, false]);
  const filterMap = {
    eth_one_time: 0,
    eth_recurring: 1,
    cash: 2,
  };
  const filterClickHandler = (event) => {
    setFilterState((prevState) => {
      var newList = [...prevState];
      newList[filterMap[event.target.id]] =
        !newList[filterMap[event.target.id]];
      console.log(newList);
      return newList;
    });
  };
  const sortClickHandler = (id) => {
    setSortOrder((prevOrder) => {
      if (prevOrder[0] == id) {
        if (prevOrder[1] == "asc") {
          return [id, "dec"];
        } else {
          return [id, "asc"];
        }
      } else {
        return [id, "dec"];
      }
    });
  };
  return (
    <div className="pt-header row">
      <div className="col-12 col-md-8 offset-md-2">
        <InputGroup className="mb-3">
          <InputGroup.Text className="search-icon">
            <FaSearch className="search-icon-svg" />
          </InputGroup.Text>
          <Form.Control
            autofill="true"
            className="search-input"
            placeholder="Search"
          />
        </InputGroup>
      </div>
      <div className="col-8 offset-2 col-md-4 offset-md-1">
        <h4 className="text-center">Sort by</h4>
        <div className="row row-cols-1 mb-1">
          <SortButton
            clickHandler={sortClickHandler}
            id="date"
            order={sortOrder}
          >
            Date
          </SortButton>
          <SortButton
            clickHandler={sortClickHandler}
            id="amt"
            order={sortOrder}
          >
            Amount
          </SortButton>
        </div>
      </div>
      <div className="col-8 offset-2 col-md-4 offset-md-2 d-flex flex-column align-items-center mb-1">
        <h4 className="text-center">Filter</h4>
        <div className="d-flex flex-row flex-sm-column">
          <div className="btn-filter-container d-flex flex-column flex-sm-row m-1">
            <button
              id="eth_one_time"
              className={`btn-filter flex-fill ${
                filterState[0] ? "btn-selected-first" : ""
              }`}
              onClick={filterClickHandler}
            >
              ETH One Time
            </button>
            <div className="flex-line-1"></div>
            <div className="flex-line-2"></div>
            <button
              id="eth_recurring"
              className={`btn-filter flex-fill ${
                filterState[1] ? "btn-selected" : ""
              }`}
              onClick={filterClickHandler}
            >
              ETH Recurring
            </button>
            <div className="flex-line-1"></div>
            <div className="flex-line-2"></div>
            <button
              id="cash"
              className={`btn-filter flex-fill ${
                filterState[2] ? "btn-selected-last" : ""
              }`}
              onClick={filterClickHandler}
            >
              Cash (Offline)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTransactionHeader;
