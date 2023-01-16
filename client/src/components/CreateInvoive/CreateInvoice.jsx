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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        black: {
            main: '#000000'

        }
    }
})


const CreateInvoice = () => {

    const handleChange = () => {
        // implement whatever you want to implement
    }

    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                                            fullWidth
                                            sx={{ m: 1 }}
                                            className="w-100"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={0}>ETH</MenuItem>
                                            <MenuItem value={0}>ETH in Installments</MenuItem>
                                            <MenuItem value={0}>Cash (offline)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password">Months to Pay</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="Months to Pay"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={12} lg={3}>
                                    <TextField
                                        label="URL"
                                        id="outlined-start-adornment"
                                        inputMode="dark"
                                        className="invoice-url"
                                        fullWidth
                                        sx={{ m: 1 }}

                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} lg={12}>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
                                            label="Amount"
                                        />
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
                                            <FormControlLabel value="male" className="invoice-form" control={<Radio />} label="Paid" />
                                            <FormControlLabel value="other" className="invoice-form" control={<Radio />} label="Unpaid" />
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
