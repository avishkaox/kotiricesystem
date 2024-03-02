import { Box, Button, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const initialValues = {
    name: ""
};

const userSchema = Yup.object().shape({
    name: Yup.string().required("Name is required")
});


const Createcategory = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append("name", values.name);

        try {
            const response = await fetch(`${API}/api/categories/create`, {
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
                toast.success("Category created successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resetForm(); // Clear the form fields
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Category creation failed";
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
           <Header title="CREATE NEW CATEGORIES" subtitle="Create Categories" />
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
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New Category
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}

export default Createcategory;