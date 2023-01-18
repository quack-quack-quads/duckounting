import { useWeb3Contract, useMoralis } from "react-moralis";
import {ethers} from "ethers";
import {abi,contractAddress} from "../../constants/index";
import { useState, useEffect } from "react";
import "./CreateInvoice.scss";
import sendFileToIpfs, { sendFileToIPFS } from "../../utils/uploadFileToIPFS"


import {
    IconButton, Box, Input, FilledInput, OutlinedInput, InputLabel, InputAdornment,
    FormHelperText, FormControl, TextField, ThemeProvider, Select, MenuItem, Button, FormLabel,
    RadioGroup, FormControlLabel, Radio, Grid
} from "@mui/material";
import { createTheme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { PhotoCamera } from "@mui/icons-material";
import { Send } from "@mui/icons-material";
import { UploadFile } from "@mui/icons-material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        black: {
            main: '#000000'

        }
    }
})


const CreateInvoice = () => {
    const {chainId:chainIdHex, isWeb3Enabled, isLoading, isFetching} = useMoralis();
    const chainId = parseInt(chainIdHex);
    const invoicePlatformAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

    const [date, setDate] = useState(null);
    const [name, setname] = useState(window.localStorage.name || "");  // name
    const [paymentMode, setPaymentMode] = useState(null);
    const [monthPayDis, setmonthPayDis] = useState(false);
    const [monthsToPay, setMonthsToPay] = useState("");
    const [amountMonthly,setamount] = useState(0);
    const [buyeraddress, setbuyeraddress] = useState("");
    const [buyerPan, setbuyerPan] = useState("");
    const [sellerPan, setSellerPan] = useState(window.localStorage.pan || "");
    const [status, setStatus] = useState(false)
    const [fileImg, setFileImg] = useState(null);
    const [url,seturl] = useState("");


    const [paidDis, setpaidDis] = useState(false);
    const [unpaidDis, setunpaidDis] = useState(false);

    const handleBuyerAddressChange = (event) => {
        setbuyeraddress(event.target.value);
    }
    const handleBuyerPanChange = (event) => {
        setbuyerPan(event.target.value);
    }
    const handleSellerPanChange = (event) => {
        setSellerPan(event.target.value);
    }

    const handleNameChange = (event) => {
        setname(event.target.value);
    }

    const handleMonthChange = (event) => {
        setMonthsToPay(event.target.value);
    }
    const handleUrlChange = (event) => {
        setFileImg(event.target.files[0]);
    }

    const handlePaymentModeChange = (event) => {
        setPaymentMode(event.target.value);
        if (event.target.value === 0) {
            setMonthsToPay(1);
            setmonthPayDis(true);
            setpaidDis(true);
            setunpaidDis(true);
        }
        else if (event.target.value == 1) {
            setMonthsToPay("");
            setmonthPayDis(false);
            setpaidDis(true);
            setunpaidDis(true);
        }
        else if (event.target.value === 2) {
            setMonthsToPay(0);
            setmonthPayDis(true);
            setunpaidDis(true);
            setpaidDis(true);
        }
    }

    const handleAmountChange = (event) => {
        setamount(event.target.value);
    }

    const handleSuccess = () => {
        alert("Hey done adding the contract")
    }

    // ! contract interaction functions
    const {runContractFunction: addInvoice} = useWeb3Contract({
        abi: abi[chainId],
        contractAddress: invoicePlatformAddress,
        functionName: "addInvoice",
        params: {
            _paymentMode: paymentMode,
            _amountMonthly: amountMonthly,
            _monthsToPay: monthsToPay,
            _status: status,
            recipient: buyeraddress,
            _sellerPAN: sellerPan,
            _buyerPAN:buyerPan,
            _date: date,
            _url: url
        }
    })

    const handleSubmit = async() => {
        setStatus(paymentMode === 2);
        seturl(await sendFileToIPFS(fileImg));
        await addInvoice({
            onSuccess: handleSuccess,
            onError: (err) => console.log(err)
        });
    } 


    return (

        <div className="Invoice">
            <div className="invoice-container container">
                <div className="container inside-invoice">

                    <ThemeProvider theme={darkTheme}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <Grid container rowSpacing={0} columnSpacing={2} >
                                <Grid item xs={12} sm={12} md={12} marginTop={{ sm: 5 }} marginBottom={{ md: 5 }}>
                                    <h1 className="invoice-form d-flex justify-content-center">
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
                                        sx={{ m: 1 }}

                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" className="w-100">Payment Mode</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Payment Mode"
                                            value={paymentMode}
                                            onChange={handlePaymentModeChange}
                                            fullWidth
                                            sx={{ m: 1 }}
                                            className="w-100"

                                        >
                                            <MenuItem value={0}>Onetime in ETH</MenuItem>
                                            <MenuItem value={1}>ETH in Installments</MenuItem>
                                            <MenuItem value={2}>Cash (offline)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password" shrink={monthPayDis || monthsToPay.length !== 0}>Months to Pay</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="Months to Pay"
                                            value={monthsToPay}
                                            disabled={monthPayDis}
                                            onChange={handleMonthChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={12} lg={3} marginLeft={{ xs: 1, sm: 0, md: 1, lg: 0 }} marginTop={{ sm: 2, xs: 1 }} marginBottom={{ xs: 1, md: 2 }} >
                                    <Button variant="outlined" className="invoice-form upl-but" size="large" endIcon={<UploadFile />}>
                                        <label htmlFor="upload">
                                            Upload Picture
                                            <Input type="file"  id="upload" className="upload-but" onChange={handleUrlChange}>Upload Picture</Input>
                                        </label>
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            error={/\D/.test(amountMonthly)}
                                            
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
                                            label="Amount"
                                            value={amountMonthly}
                                            onChange={handleAmountChange}
                                            
                                        />
                                        {/\D/.test(amountMonthly) && (
                                            <FormHelperText error id="accountId-error">
                                                Please enter numbers only
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Seller Pan</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                            value={sellerPan}
                                            onChange={handleSellerPanChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3} >
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Buyer Pan</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                            value={buyerPan}
                                            onChange={handleBuyerPanChange}
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={6} md={4} lg={3} marginLeft={{ sm: 1, xs: 1 }}>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                 label="Date of Payment"
                                                value={date}
                                                className="mt-2 ml-1"
                                                onChange={(newDate) => {
                                                    var date_ = (newDate.$d).toString();
                                                    date_ = date_.split(" ")
                                                    date_ = `${date_[1]} ${date_[2]} ${date_[3]}`
                                                    setDate(date_);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Buyer Address</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                            value={buyeraddress}
                                            onChange={handleBuyerAddressChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} lg={6} marginLeft={2} marginTop={1}>
                                    <FormControl >
                                        <FormLabel id="demo-radio-buttons-group-label">Status</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="row-radio-buttons-group"

                                        >
                                            <FormControlLabel value="male" checked={paymentMode === 2 } disabled={paidDis} className="invoice-form" control={<Radio />} label="Paid" />
                                            <FormControlLabel value="other" checked={paymentMode === 1 || paymentMode == 0} disabled={unpaidDis} className="invoice-form" control={<Radio />} label="Unpaid" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <div className="row">
                                        <Button variant="text" color="black" className="invoice-submit" size="large" onClick={handleSubmit}>Submit</Button>
                                    </div>
                                </Grid>

                            </Grid>

                        </Box>
                    </ThemeProvider>
                </div>


            </div>
        </div>
    )
}

export default CreateInvoice;
