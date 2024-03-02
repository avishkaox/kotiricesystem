import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { API } from "../../../config.js";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME , SET_USER , SET_ALL_USERS , SET_ALL_PRODUCTS , SET_ALL_ITEMS , SET_ALL_CATEGORIES , SET_ALL_PRRDUCTSFORPIECHART , SET_ALL_PURCHASEDPRODUCTS } from "../../../auth/authSlice.js";
import { getLoginStatus } from "../../../auth/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const initialValues = {
    email: "",
    password: "",
};

// yup validation
const userSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch(`${API}/api/users/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(SET_LOGIN(true));
                dispatch(SET_NAME(data.name));
                dispatch(SET_USER(data));
                dispatch(SET_ALL_USERS(data));
                dispatch(SET_ALL_PRODUCTS(data));
                dispatch(SET_ALL_ITEMS(data));
                dispatch(SET_ALL_CATEGORIES(data));
                dispatch(SET_ALL_PRRDUCTSFORPIECHART(data));
                dispatch(SET_ALL_PURCHASEDPRODUCTS(data));
                getLoginStatus();
                console.log(data);
                navigate("/");
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Login failed";
                toast.error(errorMessage, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <Box className="login-view">
            <Box className="sideview"></Box>
            <Box className="formview">
                <Typography variant="h4" className="form-title">
                    <Box
                        display="flex"
                        sx={{
                            color: "#b085d7",
                            fontSize: "41px",
                            fontWeight: "bold",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <PointOfSaleIcon sx={{ color: "black", fontSize: "70px" }} />
                        POS Login
                    </Box>
                </Typography>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={userSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{
                                        gridColumn: "span 2",
                                        color: "black !important",
                                        "& .MuiFilledInput-input": {
                                            color: `black !important`,
                                            background: "#ababab78",
                                            marginBottom: "12px",
                                            borderRadius: "5px",
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="password"
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    sx={{
                                        gridColumn: "span 2",
                                        color: "black !important",
                                        "& .MuiFilledInput-input": {
                                            color: `black !important`,
                                            background: "#ababab78",
                                            marginBottom: "12px",
                                            borderRadius: "5px",
                                        },
                                    }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    sx={{
                                        fontSize: "16px",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: "11px",
                                        background: "#0000ffab",
                                        color: "white",
                                        width: "100%",
                                    }}
                                >
                                    Login <LockOpenIcon />
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Login;
