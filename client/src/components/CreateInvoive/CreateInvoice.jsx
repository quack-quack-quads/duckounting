import { useState, useEffect } from "react";
import "./CreateInvoice.scss";

import {
    IconButton, Box, Input, FilledInput, OutlinedInput, InputLabel, InputAdornment,
    FormHelperText, FormControl, TextField, ThemeProvider, Select, MenuItem, Button
} from "@mui/material";
import { createTheme } from "@mui/material";

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="Invoice">
            <div className="invoice-container container">
                <div className="container inside-invoice mt-0">
                    <div className="row d-flex invoice-row justify-content-center">
                        <div className="col d-flex justify-content-center">
                            <h1 className="invoice-header">Create Invoice</h1>
                        </div>
                    </div>

                    <div className="row">
                        <ThemeProvider theme={darkTheme}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div className="invoice-form container">
                                    <TextField
                                        label="Your name"
                                        id="outlined-start-adornment"
                                        inputMode="dark"

                                        sx={{ m: 1, width: '25ch' }}

                                    />
                                    <FormControl  >
                                        <InputLabel id="demo-simple-select-label">Payment Mode</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Payment Mode"

                                            sx={{ m: 1, width: '24ch' }}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={0}>ETH</MenuItem>
                                            <MenuItem value={0}>ETH in Installments</MenuItem>
                                            <MenuItem value={0}>Cash (offline)</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password">Months to Pay</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="Months to Pay"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
                                            label="Amount"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Seller Pan</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Buyer Pan</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            label="Seller Pan"
                                        />
                                    </FormControl>
                                    <TextField
                                        label="Date of Payment"
                                        id="outlined-start-adornment"
                                        inputMode="dark"
                                        sx={{ m: 1, width: '25ch' }}

                                    />
                                    <TextField
                                        label="Status"
                                        id="outlined-start-adornment"
                                        inputMode="dark"
                                        sx={{ m: 1, width: '25ch' }}

                                    />
                                </div>

                            </Box>
                        </ThemeProvider>
                    </div>
                    <ThemeProvider theme={darkTheme}>
                        <div className="row">
                            <Button variant="text" color="black" className="invoice-submit" size="large">Submit</Button>
                        </div>
                    </ThemeProvider>  
                </div>


            </div>
        </div>
    )
}

export default CreateInvoice;
