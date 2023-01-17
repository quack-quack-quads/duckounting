import { useState, useEffect } from "react";
import "./CreateInvoice.scss";

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



    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(null);
    const [name, setname] = useState("");
    const [paymentMode, setPaymentMode] = useState(null);
    const [monthPayDis, setmonthPayDis] = useState(false);
    const [monthPayVal, setmonthPayVal] = useState("");
    const [paidDis, setpaidDis] = useState(false);
    const [unpaidDis, setunpaidDis] = useState(false);
    const [amount,setamount] = useState(0);

    const handleNameChange = (event) => {
        console.log(event.target.value);
        setname(event.target.value);
    }

    const handleMonthChange = (event) => {
        setmonthPayVal(event.target.value);
    }

    const handlePaymentModeChange = (event) => {
        setPaymentMode(event.target.value);
        console.log(event.target.value);
        if (event.target.value === 1) {
            setmonthPayVal(1);
            setmonthPayDis(true);
            setpaidDis(true);
            setunpaidDis(true);
        }
        else if (event.target.value == 2) {
            setmonthPayVal("");
            setmonthPayDis(false);
            setpaidDis(true);
            setunpaidDis(true);
        }
        else if (event.target.value === 3) {
            setmonthPayVal(0);
            setmonthPayDis(true);
            setunpaidDis(true);
            setpaidDis(true);
        }
    }

    const handleAmountChange = (event) => {
        setamount(event.target.value);
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
                                            <MenuItem value={1}>ETH</MenuItem>
                                            <MenuItem value={2}>ETH in Installments</MenuItem>
                                            <MenuItem value={3}>Cash (offline)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password" shrink={monthPayDis || monthPayVal.length !== 0}>Months to Pay</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="Months to Pay"
                                            value={monthPayVal}
                                            disabled={monthPayDis}
                                            onChange={handleMonthChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={12} lg={3} marginLeft={{ xs: 1, sm: 0, md: 1, lg: 0 }} marginTop={{ sm: 2, xs: 1 }} marginBottom={{ xs: 1, md: 2 }} >
                                    <Button variant="outlined" className="invoice-form upl-but" size="large" endIcon={<UploadFile />}>
                                        <label htmlFor="upload">
                                            Upload Picture
                                            <Input type="file"  id="upload" className="upload-but">Upload Picture</Input>
                                        </label>
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            error={/\D/.test(amount)}
                                            
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
                                            label="Amount"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            
                                        />
                                        {/\D/.test(amount) && (
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
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3} >
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Buyer Pan</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                        />
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={6} md={4} lg={3} marginLeft={{ sm: 1, xs: 1 }}>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date of Payment"
                                                value={value}
                                                className="mt-2 ml-1"
                                                onChange={(newValue) => {
                                                    setValue(newValue);
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
                                            <FormControlLabel value="male" checked={paymentMode === 3 } disabled={paidDis} className="invoice-form" control={<Radio />} label="Paid" />
                                            <FormControlLabel value="other" checked={paymentMode === 2 || paymentMode == 1} disabled={unpaidDis} className="invoice-form" control={<Radio />} label="Unpaid" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <div className="row">
                                        <Button variant="text" color="black" className="invoice-submit" size="large">Submit</Button>
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
