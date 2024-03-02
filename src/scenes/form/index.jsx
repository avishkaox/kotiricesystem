import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    registerid: "",
    image: null,
};

const userSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    phone: Yup.string().required("Phone is required"),
    role: Yup.string().required("Role is required"),
    registerid: Yup.number().required("Register Id is required"),
    image: Yup.mixed().required("Image is required"),
});

const Form = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("phone", values.phone);
        formData.append("role", values.role);
        formData.append("registerid", values.registerid);
        formData.append("image", values.image);

        try {
            const response = await fetch(`${API}/api/users/register`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                toast.success("User created successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resetForm(); // Clear the form fields
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "User creation failed";
                toast.error(errorMessage, {
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
    const handleImageChange = (event, setFieldValue, fieldName) => {
        const file = event.target.files[0];
        setFieldValue(fieldName, file);
    };

    return (
        <Box m="20px">
            <Header title="CREATE USER" subtitle="Create a new User Profile" />
            <Box mt="20px">
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
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4 , minmax( 0 , 1fr))"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMobile ? undefined : "span 4",
                                    },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 2" }}
                                />
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
                                    sx={{ gridColumn: "span 2" }}
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
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Phone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phone}
                                    name="phone"
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 2" }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    select
                                    label="Role"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.role}
                                    name="role"
                                    error={touched.role && Boolean(errors.role)}
                                    helperText={touched.role && errors.role}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    <MenuItem value="employee">Employee</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="cashier">Cashier</MenuItem>
                                    <MenuItem value="chef">Chef</MenuItem>
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Register ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.registerid}
                                    name="registerid"
                                    error={touched.registerid && Boolean(errors.registerid)}
                                    helperText={touched.registerid && errors.registerid}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    onBlur={handleBlur}
                                    onChange={(event) =>
                                        handleImageChange(event, setFieldValue, "image")
                                    }
                                    name="image"
                                    sx={{ gridColumn: "span 2" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New User
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Form;
