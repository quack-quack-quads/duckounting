import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import "./CreateInvoice.scss";
import { sendFileToIPFS } from "../../utils/uploadFileToIPFS";
import { TiTickOutline } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-bootstrap";
import { toPng } from "html-to-image";

import {
  IconButton,
  Box,
  Input,
  FilledInput,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  TextField,
  ThemeProvider,
  Select,
  MenuItem,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  toolbarClasses,
} from "@mui/material";
import { createTheme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { ConstructionOutlined, PhotoCamera } from "@mui/icons-material";
import { Send } from "@mui/icons-material";
import { UploadFile } from "@mui/icons-material";
import { SxProps } from "@mui/system";
import stamp from "../../assets/images/stamp.png";
import Footer from "../Footer/Footer";
import axios from "axios";
import GenerateInvoiceHtml from "../GenerateInvoice/GenerateInvoiceImage";
import { useRef } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    black: {
      main: "#000000",
    },
    yellow: {
      main: "#efd00b !important",
    },
  },
});

const styles = (theme) => ({
  notchedOutline: {
    borderColor: "#efd00b !important",
  },
});

const CreateInvoice = ({ contractAbi, invoicePlatformAddress }) => {
  const [date, setDate] = useState(null);
  const [name, setname] = useState(window.localStorage.name || ""); // name
  const [paymentMode, setPaymentMode] = useState(null);
  const [monthPayDis, setmonthPayDis] = useState(false);
  const [monthsToPay, setMonthsToPay] = useState("");
  const [amountMonthly, setamount] = useState(0);
  const [buyerPan, setbuyerPan] = useState("");
  const [sellerPan, setSellerPan] = useState(window.localStorage.pan || "");
  const [status, setStatus] = useState(false);
  const [fileImg, setFileImg] = useState(null);
  const [url, seturl] = useState("");
  const [uint32No, setuint32No] = useState(0);

  const [paidDis, setpaidDis] = useState(true);
  const [unpaidDis, setunpaidDis] = useState(true);
  const [done, setDone] = useState(null);

  /* Variables for currency converter */
  const [exchangeRate, setExchangeRate] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [currency, setCurrency] = useState(61);
  const [localAmount, setLocalAmount] = useState("");

  /*Variables for auto invoice image button */
  const [picMode, setPic] = useState(0);

  console.log(date);

  const handlePicMode = (event) => {
    setPic(event.target.value);
  }

  const handleBuyerPanChange = (event) => {
    setbuyerPan(event.target.value);
  };
  const handleSellerPanChange = (event) => {
    setSellerPan(event.target.value);
  };

  const handleNameChange = (event) => {
    setname(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonthsToPay(event.target.value);
  };
  const handleUrlChange = (event) => {
    setFileImg(event.target.files[0]);
  };

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
    if (event.target.value === 0) {
      setMonthsToPay(1);
      setmonthPayDis(true);
      setpaidDis(true);
      setunpaidDis(true);
    } else if (event.target.value == 1) {
      setMonthsToPay("");
      setmonthPayDis(false);
      setpaidDis(true);
      setunpaidDis(true);
    } else if (event.target.value === 2) {
      setMonthsToPay(0);
      setmonthPayDis(true);
      setunpaidDis(true);
      setpaidDis(true);
    }
  };

  const handleAmountChange = (event) => {
    setamount(event.target.value);
  };

  const handleSuccess = async () => {
    toast.success("Invoice added to blockchain.", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleCurrencyChange = (event) => {
    console.log(event.target.value - 1);
    setCurrency(event.target.value);
    const amt = localAmount;
    const rate = currencyList[currency - 1].rate;
    const ethAmount = amt / rate;
    ethAmount = ethAmount.toFixed(10);
    setamount(ethAmount.toString());
  };

  const handleConverterChange = (event) => {
    setLocalAmount(event.target.value);
    var amt = event.target.value;

    var rate = currencyList[currency - 1].rate;
    var ethAmount = amt / rate;
    ethAmount = ethAmount.toFixed(10);
    console.log(ethAmount);
    setamount(ethAmount.toString());
  };

  const formatDate = () => {
    if (date == null) return;
    var dt = date;
    var parts = dt.split(" ");

    const months = new Map([
      ["Jan", 1],
      ["Feb", 2],
      ["Mar", 3],
      ["Apr", 4],
      ["May", 5],
      ["Jun", 6],
      ["Jul", 7],
      ["Aug", 8],
      ["Sep", 9],
      ["Oct", 10],
      ["Nov", 11],
      ["Dec", 12],

    ])

    var st = parts[1].toString() + '/' + (months.get(parts[0])) + "/" + parts[2]


    return st;

  }

  console.log(formatDate(date))
  // ! contract interaction functions
  const { runContractFunction: addInvoice } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: invoicePlatformAddress,
    functionName: "addInvoice",
    params: {
      _paymentMode: paymentMode,
      _amountMonthly: uint32No,
      _monthsToPay: monthsToPay,
      _status: status,
      _sellerPAN: sellerPan,
      _buyerPAN: buyerPan,
      _date: date,
      _url: url,
    },
  });

  useEffect(() => {
    if (url !== "") {
      setDone(true);
      addInvoice({
        onSuccess: handleSuccess,
        onError: (err) => {
          // console.log(err.message);
          toast.error(`Ouch! An error occured : ${err}`, {
            position: toast.POSITION.TOP_CENTER,
          });
        },
      });
    }
  }, [url]);

  useEffect(() => {
    if (exchangeRate.length === 0) {
      fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH")
        .then((res) => {
          res.json().then((res1) => {
            setExchangeRate(res1.data.rates);
            let lis = [];
            let count = 1;
            for (var key in res1.data.rates) {
              var obj = {
                name: key,
                id: count,
                rate: res1.data.rates[key],
              };
              lis.push(obj);
              count++;
            }
            setCurrencyList(lis);
            console.log(lis);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const handleSubmit = async () => {
    if (fileImg === null) {
      toast.error("Please select an image!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (paymentMode === null) {
      toast.error("Please enter the payment mode!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (sellerPan.length === 0) {
      toast.error("Please enter the Seller Pan!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (buyerPan.length === 0) {
      toast.error("Please enter the Buyer Pan!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (date === null) {
      toast.error("Please enter the date!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    const decimals = 18;
    const trans_amount = amountMonthly;

    let amt = amountMonthly;
    amt.toString();

    setuint32No(async (prev) => {
      var new_amt = ethers.utils.parseEther(amt).toString();
      setStatus(paymentMode === 2);
      seturl(async (prev2) => {
        setDone(false);
        console.log(done);
        var new_url = sendFileToIPFS(fileImg);
        await toast.promise(new_url, {
          pending: "Uploading image to IPFS ...",
          success: "Image uploaded to IPFS",
          error: "Error uploading image to IPFS",
        });
        console.log("this is url", new_url);
        if (new_url === null) {
          setDone(null);
          return "";
        }
        return new_url;
      });
      return new_amt;
    });
    console.log(done);
    if (done !== null) {
      const resolveafterset = new Promise((resolve, reject) => {
        if (done === true) {
          resolve();
        } else if (done === null) {
          reject();
        }
      });
      console.log("called me!");
    }
  };

  const sizeVal = () => {
    return 35;
  };

  const checkAmount = (x) => {
    return !/^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(x);
  };

  const popperSx: SxProps = {
    "& .MuiPaper-root": {
      backgroundColor: "#efd00b",
      borderColor: "#efd00b",
    },
    "& .MuiCalendarPicker-root": {
      backgroundColor: "#3c3a05",
    },

    "& .MuiTabs-root": { backgroundColor: "#efd00b" },
  };

  const [showAGI, setShowAGI] = useState(false);

  const handleShow = () => {

    if (paymentMode === null) {
      toast.error("Please enter the payment mode!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (sellerPan.length === 0) {
      toast.error("Please enter the Seller Pan!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (buyerPan.length === 0) {
      toast.error("Please enter the Buyer Pan!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (date === null) {
      toast.error("Please enter the date!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    setShowAGI(true);
  };

  const handleClose = () => {
    setShowAGI(false);
  };

  const domEl = useRef(null);

  const downloadImage = async () => {
    const dataUrl = await toPng(domEl.current, { backgroundColor: "white" });
    const link = document.createElement("a");
    link.download = "Invoice" + ".png";
    link.href = dataUrl;
    link.click();
    setShowAGI(false);
  };

  return (
    <>
      <Modal size="lg" show={showAGI} onHide={handleClose}>
        <div className="agi-modal">
          {/* <Modal.Header closeButton>
            <Modal.Title>Auto-generate invoice image</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>
            <GenerateInvoiceHtml
              ref={domEl}
              date={formatDate(date)}
              sellerName={name}
              sellerPan={sellerPan}
              buyerPan={buyerPan}
              amount={amountMonthly}
              status={paymentMode == 2 ? "PAID" : "UNPAID"}
              monthsLeft={monthsToPay}
            />
          </Modal.Body>
          {/* <Modal.Footer className>
            <Button variant="primary" onClick={downloadImage}>
              Download
            </Button>
          </Modal.Footer> */}
          <div className="d-flex flex-row justify-content-center mb-4">
            <Button variant="primary" onClick={downloadImage}>
              Download
            </Button>
          </div>
        </div>
      </Modal>
      <div className="Invoice container">
        <ToastContainer theme="dark" />
        <div className="invoice-container container">
          <div className="row stamp-row">
            <img src={stamp}></img>
          </div>
          <div className="row stamp-row2">
            <div className="container inside-invoice">
              <ThemeProvider theme={darkTheme}>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  <Grid container rowSpacing={0} columnSpacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      marginTop={{ sm: 5 }}
                      marginBottom={{ md: 5 }}
                    >
                      <h1 className="invoice-form d-flex justify-content-center inv-head">
                        Create Invoice
                      </h1>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        error={name == ""}
                        value={name}
                        onChange={handleNameChange}
                        onClick={handleNameChange}
                        helperText={name == "" ? "Please enter a name" : ""}
                        label="Your name"
                        id="outlined-start-adornment"
                        inputMode="dark"
                        fullWidth
                        sx={{
                          m: 1,
                          "& .MuiInputLabel-root": { color: "grey" }, //styles the label
                          "& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: "#efd00b" },
                          },
                          "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                              borderColor: "#8B8000",
                              color: "grey",
                            },
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                              borderColor: "#FCF55F",
                            },
                          },
                        }}
                        className="inv-name"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-simple-select-label"
                          className="w-100"
                        >
                          Payment Mode
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Payment Mode"
                          value={paymentMode}
                          onChange={handlePaymentModeChange}
                          fullWidth
                          sx={{
                            m: 1,
                            borderColor: "yellow.main",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "white",
                            },
                            "& .MuiOutlinedInput.Mui-Select": {
                              "& > fieldset": {
                                borderColor: "#FCF55F",
                              },
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                          }}
                          className="w-100"
                        >
                          <MenuItem value={0}>Onetime in ETH</MenuItem>
                          <MenuItem value={1}>ETH in Installments</MenuItem>
                          <MenuItem value={2}>Cash (offline)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <InputLabel
                          htmlFor="outlined-adornment-password"
                          shrink={monthPayDis || monthsToPay.length !== 0}
                        >
                          Months to Pay
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type="text"
                          label="Months to Pay"
                          value={monthsToPay}
                          disabled={monthPayDis}
                          onChange={handleMonthChange}
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b",
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>



                    <Grid
                      item
                      className="upl-but-col d-flex"
                      xs={fileImg === null ? 12 : 6}
                      sm={fileImg === null ? 6 : 4}
                      md={fileImg === null ? 12 : 8}
                      lg={fileImg === null ? 3 : 2}
                      marginLeft={{ xs: 1, sm: 0, md: 1, lg: 0 }}
                      marginTop={{ sm: 2, xs: 1 }}
                      marginBottom={{ xs: 1, md: 2 }}
                      marginRight={{ md: 0 }}
                    >
                      <Grid>
                        <Button
                          variant="outlined"
                          className="invoice-form upl-but"
                          size="large"
                          endIcon={<UploadFile />}
                        >
                          <label htmlFor="upload">
                            {fileImg === null ? "Upload" : "Uploaded!"}
                            <Input
                              type="file"
                              id="upload"
                              className="upload-but"
                              onChange={handleUrlChange}
                            >
                              Upload Picture
                            </Input>
                          </label>
                        </Button>
                      </Grid>
                      {fileImg !== null ? (
                        <Grid
                          item
                          xs={1}
                          sm={1}
                          md={1}
                          lg={1}
                          marginTop={{ xs: 0, sm: 0, md: 0 }}
                          marginRight={{ xs: 0 }}
                          className="tick"
                          marginLeft={{ xs: 0, sm: 2, md: 1 }}
                          marginBottom={{ md: 2 }}
                        >
                          <TiTickOutline size={sizeVal()} color="grey" />
                        </Grid>
                      ) : null}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-simple-select-label"
                          className="w-100"
                        >
                          Currency
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Currency"
                          value={currency}
                          onChange={handleCurrencyChange}
                          fullWidth
                          sx={{
                            m: 1,
                            borderColor: "yellow.main",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "white",
                            },
                            "& .MuiOutlinedInput.Mui-Select": {
                              "& > fieldset": {
                                borderColor: "#FCF55F",
                              },
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                          }}
                          className="w-100"
                        >
                          {currencyList.map((item) => {
                            return (
                              <MenuItem value={item.id}>{item.name}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <FormControl fullWidth sx={{ m: 1 }}>
                        {/* {console.log(currencyList[currency-1], currency)} */}
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Amount in{" "}
                          {currencyList.length === 0
                            ? "INR"
                            : currencyList[currency - 1].name}
                        </InputLabel>
                        <OutlinedInput
                          error={checkAmount(amountMonthly)}
                          id="outlined-adornment-amount"
                          startAdornment={
                            <InputAdornment position="start">Ξ</InputAdornment>
                          }
                          label={`Amount in ${currencyList.length === 0
                            ? "INR"
                            : currencyList[currency - 1].name
                            }`}
                          onChange={handleConverterChange}
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b ",
                            },
                          }}
                        />
                        {checkAmount(amountMonthly) && (
                          <FormHelperText error id="accountId-error">
                            Please enter numbers only
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Amount in ETH
                        </InputLabel>
                        <OutlinedInput
                          error={checkAmount(amountMonthly)}
                          id="outlined-adornment-amount"
                          value={amountMonthly}
                          startAdornment={
                            <InputAdornment position="start">Ξ</InputAdornment>
                          }
                          label="Amount in ETH"
                          onChange={handleAmountChange}
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b ",
                            },
                          }}
                        />
                        {checkAmount(amountMonthly) && (
                          <FormHelperText error id="accountId-error">
                            Please enter numbers only
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Seller Pan
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          label="Seller Pan"
                          value={sellerPan}
                          onChange={handleSellerPanChange}
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b ",
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">
                          Buyer Pan
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          label="Seller Pan"
                          value={buyerPan}
                          onChange={handleBuyerPanChange}
                          sx={{
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FCF55F",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#8B8000",
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#efd00b ",
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      marginLeft={{ sm: 1, xs: 1 }}
                    >
                      <FormControl
                        fullWidth
                        sx={{
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#FCF55F",
                          },
                          "&:hover .MuiOutlinedInput-root": {
                            borderColor: "#8B8000",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#efd00b ",
                          },
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Date of Payment"
                            value={date}
                            className="mt-2 ml-1"
                            onChange={(newDate) => {
                              var date_ = newDate.$d.toString();
                              date_ = date_.split(" ");
                              date_ = `${date_[1]} ${date_[2]} ${date_[3]}`;
                              setDate(date_);
                            }}
                            sx={{
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#FCF55F",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#8B8000",
                              },
                              ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "#efd00b ",
                              },
                            }}
                            PopperProps={{
                              sx: popperSx,
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                    <Grid md={8}>

                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      marginLeft={2}
                      marginTop={1}
                      className="check-status"
                    >
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Status
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="male"
                            checked={paymentMode === 2}
                            disabled={paidDis}
                            className="invoice-form"
                            control={<Radio />}
                            label="Paid"
                            sx={{
                              ".MuiRadio-root": {
                                borderColor: "#efd00b ",
                                color: "#efd00b ",
                              },
                            }}
                          />
                          <FormControlLabel
                            value="other"
                            checked={paymentMode === 1 || paymentMode == 0}
                            disabled={unpaidDis}
                            className="invoice-form"
                            control={<Radio />}
                            label="Unpaid"
                            sx={{
                              ".MuiRadio-root": {
                                borderColor: "#efd00b ",
                                color: "#efd00b ",
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>


                    </Grid>

                    <Grid sm={12} md={5} xs={12} lg={4} marginLeft={{ xs: 3 }} className="check-auto">
                      <FormControl  >
                        <Button
                          variant="outlined"
                          className="invoice-form upl-but"
                          size="large"
                          onClick={handleShow}
                        >

                          Auto Generate Image


                        </Button>
                      </FormControl>
                    </Grid>



                    <Grid item xs={12} sm={12} lg={12}>
                      <div className="row">
                        <Button
                          variant="text"
                          color="black"
                          className="invoice-submit"
                          size="large"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </Grid>

                  </Grid>
                </Box>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
      <Button variant="primary" >
        Auto-generate image
      </Button>
    </>
  );
};

export default CreateInvoice;
