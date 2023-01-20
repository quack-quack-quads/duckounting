import { useState } from "react";
import "./TransactionHistoryCard.scss";
import { FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import SortButton from "./SortButton";

const TransactionHistoryTableHeader = (props) => {
  const [isBuyer, setIsBuyer] = useState(false);

  const [sortOrder, setSortOrder] = useState(["date", "dec"]);
  const [filterState, setFilterState] = useState([false, false]);
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
  const filterClickHandler = (event) => {
    setFilterState((prevState) => {
      const id = event.target.id;
      prevState[id] = !prevState[id];
      console.log(prevState);
      return prevState;
    });
  };
  return (
    <div className="th-header row">
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
        <div className="row row-cols-1 row-cols-sm-2 mb-1">
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
      <div className="col-8 offset-2 col-md-4 offset-md-2 d-flex flex-column align-items-center">
        <h4 className="text-center">Filter</h4>
        <div className="btn-filter-container d-flex flex-column flex-sm-row">
          <button
            id="buyer"
            className={`btn-filter ${filterState[0] ? "btn-selected" : ""}`}
            onClick={() => {
              setFilterState((prevState) => {
                return [!prevState[0], prevState[1]];
              });
              console.log(filterState);
              console.log(filterState["buyer"] ? "btn-selected" : "");
            }}
          >
            Buyer
          </button>
          <div className="flex-line"></div>
          <button
            id="seller"
            className={`btn-filter ${
              filterState["seller"] ? "btn-selected" : ""
            }`}
            onClick={filterClickHandler}
          >
            Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTableHeader;
