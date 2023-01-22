import "./DuckBoard.scss";
import ProfileCard from "../../components/Profilecard/ProfileCard";
import { Card, Illustration } from "web3uikit";
import { IpfsImage } from "react-ipfs-image";
import { useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { parseBase64 } from "../../utils/parseBase64ToJson";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import { ConstructionOutlined } from "@mui/icons-material";
import Footer from "../../components/Footer/Footer";
import { Modal, Button } from "react-bootstrap";

const DuckBoard = ({
  account,
  logout,
  invoicePlatformAddress,
  contractAbi,
}) => {
  const [tokenId, setTokenId] = useState(null);
  const [uri, setUri] = useState(null);
  const [duckIndex, setDuckIndex] = useState(0.7);
  const [rating, setRating] = useState("4");
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { runContractFunction: getTokenId } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: invoicePlatformAddress,
    functionName: "getTokenId",
    params: {
      _pan:
        window.localStorage.getItem("pan") ||
        "0x0000000000000000000000000000000000000000",
    },
  });

  const { runContractFunction: tokenURI } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: invoicePlatformAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: getPersonDetails } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: invoicePlatformAddress,
    functionName: "getPerson",
    params: {
      PAN: window.localStorage.getItem("pan"),
    }
  })

  const retrieveDetails = async () => {
    const tokenid = await getTokenId();
    setTokenId(tokenid);
    const person = await getPersonDetails();
    setRating(person.rating.toString());
  };

  const getNft = async () => {
    // sleep for 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
    let uri_ = await tokenURI();
    if (uri_ !== undefined) {
      uri_ = parseBase64(uri_.toString());
      uri_ = uri_.image;
      setUri(uri_);
    }
    // console.log(tokenId.toString(), uri_);
  };

  const ratingmap = {
    "5" : "Enterprise",
    "4" : "Exquisite",
    "3" : "Exquisite",
    "2" : "Normie",
    "1" : "Normie",
  }
  useEffect(() => {
    retrieveDetails();
  }, [invoicePlatformAddress]);

  useEffect(() => {
    getNft();
  }, [tokenId]);

  const navigate = useNavigate();

  const nftwidget = (
    <Card
      className="nftcard"
      description={"You are rated " + rating + " on the platform"}
      onClick={() => { }}
      setIsSelected={() => {
        return false;
      }}
      title={ratingmap[rating] + " Duck"}
      tooltipText={
        <span style={{ width: 60 }}>
          "The users who sign/reject the contracts you send them rate you out of
          five. Highly rated users get an NFT :)"
        </span>
      }
    >
      <div>
        {uri ? (
          <IpfsImage
            hash={uri}
            gatewayUrl="https://gateway.pinata.cloud/ipfs"
            className="nftimage"
          />
        ) : (
          // CENTER THE SPINNER
          <div className="row justify-content-center">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        )}
      </div>
    </Card>
  );

  const duckountingIndex = (
    <Card
      className="dicard"
      description="You have a duckountability index of 70%"
      title="Duckountability Index"
      onClick={() => { }}
      setIsSelected={() => {
        return false;
      }}
      tooltipText={
        <span style={{ width: 200, zIndex: 1000 }}>
          Your duckountability index is calculated on the basis of how regular you
          were in paying due amounts on your invoices
        </span>
      }
    >
      <div>
        <GaugeChart
          id="gauge-chart1"
          nrOfLevels={10}
          colors={["#000000", "#00FF00"]}
          percent={duckIndex}
          textColor={"#000000"}
          animateDuration={5000}
        ></GaugeChart>
      </div>
    </Card>
  );

  return (
    <div className="DuckBoard">
      {/* top section in md screen onwards */}
      <div className="largescreens d-none d-md-block">
        <div className="topbanner row">
          {/* for showing credentials */}
          <div className="col-12 col-md-6 col-lg-5 credcol">
            <div className="credbox">
              <div className="row">
                <div className="col-8">
                  <div className="row credrow">
                    {localStorage.getItem("name")}
                  </div>
                  <div className="row credrow yellowtext">
                    {localStorage.getItem("pan")}
                  </div>
                </div>
                <div className="col-4 centercol logoutcol">
                  {account ? (
                    <div className="logout">
                      <AiOutlineLogout
                        color="red"
                        size={30}
                        onClick={() => {
                          setShowLogoutAlert(true);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="col logoutcol"></div>
        </div>
        <div className="row cardrow">
          <div className="col-md-3 col-lg-4">
            <ProfileCard
              image="token"
              label="Want to send someone an invoice?"
              button="CREATE INVOICE"
              handler={() => {
                navigate("/createInvoice");
              }}
            />
            <ProfileCard
              image="servers"
              label="Want to take a look at your past invoices?"
              button="HISTORY"
              handler={() => {
                navigate("/transactionhistory");
              }}
            />
          </div>
          <div className="col-md-3 col-lg-4 dicardcol">{duckountingIndex}</div>
          {/* <div className="col d-none d-md-block d-lg-none"></div> */}
          <div className="col-md-5 col-lg-4 nftcardcol">
            <div className="wrapperdiv">
              <div className="row">
                {nftwidget}
              </div>
              <div className="row">
                <img src="../assets/images/duck.png" alt="" className="ducklogo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="smallscreens d-block d-md-none">
        <div className="topbanner">
          {/* for showing credentials */}
          <div className="row centercol">
            <div className="credbox">
              <div className="row">
                <div className="col-8">
                  <div className="row credrow">
                    {localStorage.getItem("name")}
                  </div>
                  <div className="row credrow yellowtext">
                    {localStorage.getItem("pan")}
                  </div>
                </div>
                <div className="col-4 centercol logoutcol">
                  {account ? (
                    <div className="logout">
                      <AiOutlineLogout
                        color="red"
                        size={30}
                        onClick={() => {
                          setShowLogoutAlert(true);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
                    <div className="col logoutcol">
                        <div className="logout">
                            <AiOutlineLogout color="red" size={30}
                                onClick={logout}
                            />
                        </div>
                    </div>
                </div> */}
        </div>
        <div className="row cardrow">
          <div className="col-6 centercol">
            <button
              className="btn btn-warning profbtn"
              onClick={() => {
                console.log("btn click");
                navigate("/createInvoice");
              }}
            >
              CREATE INVOICE
            </button>
          </div>
          <div className="col-6 centercol">
            <button
              className="btn btn-warning profbtn"
              onClick={() => navigate("/transactionhistory")}
            >
              PAST TRANSACTIONS
            </button>
          </div>
        </div>
        <div className="row centercol">{nftwidget}</div>
        <div className="row centercol">{duckountingIndex}</div>
      </div>
      <Footer />

      <Modal
        show={showLogoutAlert}
        onHide={() => {
          setShowLogoutAlert(false);
        }}
      >
        <div className="logoutModal">
          <Modal.Body>
            <p className="row m-2">Are you sure you want to logout?</p>
            <div className="d-flex flex-row justify-content-end">
              <Button
                className="m-1"
                variant="warning"
                onClick={() => {
                  setShowLogoutAlert(false);
                }}
              >
                No
              </Button>
              <Button
                className="m-1"
                variant="danger"
                onClick={() => {
                  setShowLogoutAlert(false);
                  logout();
                  navigate("/");
                }}
              >
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default DuckBoard;
