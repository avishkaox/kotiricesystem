import { Box, Button, TextField, MenuItem, Typography, useTheme } from "@mui/material";
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from 'react';
import { getAllItems, getAllCategories } from "../../auth/authService.js";
import Header from "../../components/Header";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import { tokens } from "../../theme";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";

const initialValues = {
    name: "",
    category: "",
    items: "",
    price: "",
    collectlocation: "",
    image: null,
    waitingtime: "",
};

const userSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    category: Yup.string().required("Category is required"),
    items: Yup.string().required("Items is required"),
    price: Yup.number().required("Price is required"),
    collectlocation: Yup.string().required("Collect location is required"),
    waitingtime: Yup.string().required("Waiting Time  is required"),
    image: Yup.mixed().required("Image is required"),
});



const Createproduct = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const user = useSelector(selectUser);

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [quantity, setQuantity] = useState("");

    // State to hold the allproducts data
    const [allItems, setAllItems] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // Get all user data from localStorage or fetch from backend API
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all product data from the backend API
    const fetchData = async () => {
        try {
            const items = await getAllItems();
            const categories = await getAllCategories();
            setAllItems(items);
            setAllCategories(categories);
        } catch (error) {
            console.log(error);
        }
    };




    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values, { resetForm }) => {

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("category", values.category);
        formData.append("items", JSON.stringify(selectedItems));
        formData.append("price", values.price);
        formData.append("collectlocation", values.collectlocation);
        formData.append("waitingtime", values.waitingtime);
        formData.append("image", values.image);
        formData.append("user", user._id)

       

        try {
            const response = await fetch(`${API}/api/products`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                toast.success("Product created successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                resetForm(); // Reset the form
                setSelectedItems([]); // Clear the selected items
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Product creation failed";
                toast.error(errorMessage, {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('asas', error);
            toast.error("An error occurred. Please try again.", {
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
    const handleDeleteItem = (itemId) => {
        setSelectedItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
    };
    return (
        <Box m="20px" >
            <Header className="Header" title="CREATE FOOD ITEMS" subtitle="Create New Food Items" />
            <Box mt="20px" >
                <Formik
                    initialValues={initialValues}
                    validationSchema={userSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
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
                                    select
                                    label="Category"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category}
                                    name="category"
                                    error={touched.category && Boolean(errors.category)}
                                    helperText={touched.category && errors.category}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {allCategories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Price"
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
                                    select
                                    label="Collect Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.collectlocation}
                                    name="collectlocation"
                                    error={touched.collectlocation && Boolean(errors.collectlocation)}
                                    helperText={touched.collectlocation && errors.collectlocation}
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    <MenuItem value="Kitchen">Kitchen</MenuItem>
                                    <MenuItem value="Bar">Bar</MenuItem>
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Waiting Time"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.waitingtime}
                                    name="waitingtime"
                                    error={touched.waitingtime && Boolean(errors.waitingtime)}
                                    helperText={touched.waitingtime && errors.waitingtime}
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
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    select
                                    label="Items"
                                    onBlur={handleBlur}
                                    onChange={(event) => {
                                        setSelectedItemId(event.target.value)
                                        setFieldValue('items', event.target.value);
                                    }}
                                    value={selectedItemId}
                                    name="items"
                                    sx={{ gridColumn: "span 2" }}
                                >
                                    {allItems.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Quantity"
                                    onBlur={handleBlur}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    value={quantity}
                                    name="quantity"
                                    error={touched.quantity && Boolean(errors.quantity)}
                                    helperText={touched.quantity && errors.quantity}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        if (selectedItemId && quantity) {
                                            setSelectedItems((prevItems) => [
                                                ...prevItems,
                                                {
                                                    itemId: selectedItemId,
                                                    quantity: parseInt(quantity), // Convert to number
                                                },
                                            ]);
                                            setSelectedItemId(""); // Reset the item selection field
                                            setQuantity(""); // Reset the quantity field
                                        }
                                    }}
                                    sx={{ gridColumn: "span 2", alignSelf: "flex-end" }}
                                >
                                    Add Item
                                </Button>
                                <Box gridColumn="span 4">
                                    {selectedItems.map((item) => (
                                        <Box className="itembox" sx={{ backgroundColor: colors.blueAccent[400], color: "white" }} key={item.itemId} display="inline-flex" alignItems="center">
                                            <Typography>
                                                Item: {allItems.find((i) => i._id === item.itemId)?.name}, Quantity: {item.quantity}{allItems.find((i) => i._id === item.itemId)?.usedby}
                                            </Typography>
                                            <Button
                                                // variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteItem(item.itemId)}
                                                sx={{ ml: 20, backgroundColor: "#ff6b6b", color: "#fff", border: "none" }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            {/* <Box display="flex" justifyContent="end" mt="20px"> */}
                            <Button type="submit" color="secondary" variant="contained">
                                Create New Product
                            </Button>
                            {/* </Box> */}
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default Createproduct;