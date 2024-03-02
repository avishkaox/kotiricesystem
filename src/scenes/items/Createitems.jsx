import { Box, Button, TextField } from "@mui/material";
import { Formik , Form } from "formik";
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";
import "react-toastify/dist/ReactToastify.css";



const initialValues = {
    name: "",
    price: "",
    usedby: "",
    quantity: "",
};

const userSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required"),
    usedby: Yup.string().required("Used by is required"),
    quantity: Yup.number().required("Quantity is required"),
});

const Createitems = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const user = useSelector(selectUser);

    const handleFormSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("usedby", values.usedby);
        formData.append("quantity", values.quantity);
        formData.append("user", user._id)
        values.user = user._id;

        try {
            const response = await fetch(`${API}/api/items`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                toast.success("Item created successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resetForm(); // Clear the form fields
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Item creation failed";
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
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <Box m="20px">
            <Header title="CREATE ITEMS" subtitle="Create New Items" />
            <Box mt="20px">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={userSchema}
                >
                     {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
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
                                    type="number"
                                    label="price"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.price}
                                    name="price"
                                    error={touched.price && Boolean(errors.price)}
                                    helperText={touched.price && errors.price}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Usedby"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.usedby}
                                    name="usedby"
                                    error={touched.usedby && Boolean(errors.usedby)}
                                    helperText={touched.usedby && errors.usedby}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Quantity"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.quantity}
                                    name="quantity"
                                    error={touched.quantity && Boolean(errors.quantity)}
                                    helperText={touched.quantity && errors.quantity}
                                    sx={{ gridColumn: "span 2" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New Item
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}

export default Createitems;