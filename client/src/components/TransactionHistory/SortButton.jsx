import { Card } from "react-bootstrap";
import "./TransactionHistoryCard.scss";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";

const SortButton = (props) => {
  const onClickHandler = () => {
    props.clickHandler(props.id);
  };
  return (
    <div className="p-1">
      <Card
        className="d-flex flex-row sort-button align-items-center p-1"
        onClick={onClickHandler}
      >
        <p className="text-center flex-fill my-1 user-select-none">
          {props.children}
        </p>
        <div className="flex-shrink-1">
          {props.order[0] == props.id && props.order[1] == "asc" && (
            <AiOutlineArrowUp />
          )}
          {props.order[0] == props.id && props.order[1] == "dec" && (
            <AiOutlineArrowDown />
          )}
          {props.order[0] != props.id && (
            <AiOutlineArrowDown className="opacity-0" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default SortButton;
