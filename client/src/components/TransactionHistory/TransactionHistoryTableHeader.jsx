import { useState } from "react";
import "./TransactionHistoryCard.scss";
import { FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import SortButton from "./SortButton";

const TransactionHistoryTableHeader = (props) => {
  const [isBuyer, setIsBuyer] = useState(false);
  const [sortOrder, setSortOrder] = useState(["date", "dec"]);
  const [filterState, setFilterState] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const filterMap = {
    buyer: 0,
    seller: 1,
    paid: 2,
    pending: 3,
    eth_one_time: 4,
    eth_recurring: 5,
    cash: 6,
  };
  const filterClickHandler = (event) => {
    setFilterState((prevState) => {
      var newList = [...prevState];
      newList[filterMap[event.target.id]] =
        !newList[filterMap[event.target.id]];
      props.filter(newList);
      return newList;
    });
  };
  const sortClickHandler = (id) => {
    setSortOrder((prevOrder) => {
      if (prevOrder[0] == id) {
        if (prevOrder[1] == "asc") {
          props.sort([id, "dec"]);
          return [id, "dec"];
        } else {
          props.sort([id, "asc"]);
          return [id, "asc"];
        }
      } else {
        props.sort([id, "dec"]);
        return [id, "dec"];
      }

    })
    // console.log(sortOrder);

  };
  const onSearchChange = (event) => {
    props.search(event.target.value);
  }

  return (
    <div className="th-header row">
      <div className="col-12">
        <InputGroup className="mb-3 mt-3 searchbar">
          <InputGroup.Text className="search-icon">
            <FaSearch className="search-icon-svg" />
          </InputGroup.Text>
          <Form.Control
            autofill="true"
            className="search-input"
            placeholder="Search"
            onChange={onSearchChange}
          />
        </InputGroup>
      </div>

      <div className="row">
        <div className="col-4 centercol">
          SORT BY
        </div>
        <div className="col-4 btncol">
          <SortButton
            clickHandler={sortClickHandler}
            id="date"
            order={sortOrder}
          >
            Date
          </SortButton>
        </div>
        <div className="col-4 btncol">
          <SortButton
            clickHandler={sortClickHandler}
            id="amount"
            order={sortOrder}
          >
            Amount
          </SortButton>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-4 centercol">
          FILTERS
        </div>
      </div>

      <div className="d-flex flex-row flex-sm-column justify-content-center">
        <div className="btn-filter-container d-flex flex-column flex-sm-row">
          <button
            id="buyer"
            className={`btn-filter flex-fill ${filterState[0] ? "btn-selected-first" : ""
              }`}
            onClick={filterClickHandler}
          >
            Buyer
          </button>
          <div className="flex-line-1"></div>
          <div className="flex-line-2"></div>
          <button
            id="seller"
            className={`btn-filter flex-fill ${filterState[1] ? "btn-selected-last" : ""
              }`}
            onClick={filterClickHandler}
          >
            Seller
          </button>
        </div>

        <div className="btn-filter-container d-flex flex-column flex-sm-row m-1">
          <button
            id="paid"
            className={`btn-filter flex-fill ${filterState[2] ? "btn-selected-first" : ""
              }`}
            onClick={filterClickHandler}
          >
            Paid
          </button>
          <div className="flex-line-1"></div>
          <div className="flex-line-2"></div>
          <button
            id="pending"
            className={`btn-filter flex-fill ${filterState[3] ? "btn-selected-last" : ""
              }`}
            onClick={filterClickHandler}
          >
            Pending
          </button>
        </div>

        <div className="btn-filter-container d-flex flex-column flex-sm-row m-1">
          <button
            id="eth_one_time"
            className={`btn-filter flex-fill ${filterState[4] ? "btn-selected-first" : ""
              }`}
            onClick={filterClickHandler}
          >
            ETH One Time
          </button>
          <div className="flex-line-1"></div>
          <div className="flex-line-2"></div>
          <button
            id="eth_recurring"
            className={`btn-filter flex-fill ${filterState[5] ? "btn-selected" : ""
              }`}
            onClick={filterClickHandler}
          >
            ETH Recurring
          </button>
          <div className="flex-line-1"></div>
          <div className="flex-line-2"></div>
          <button
            id="cash"
            className={`btn-filter flex-fill ${filterState[6] ? "btn-selected-last" : ""
              }`}
            onClick={filterClickHandler}
          >
            Cash (Offline)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTableHeader;
