import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { getAllProducts } from "../../auth/authService.js";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import SoupKitchenOutlinedIcon from '@mui/icons-material/SoupKitchenOutlined';
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";


const Manageproducts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(selectUser);
    // State to hold the allUsers data
    const [allProducts, setAllProducts] = useState([]);
    const [temp, settemp] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Get all user data from localStorage or fetch from backend API
    useEffect(() => {
        setLoading(true);
        console.log('temp', temp)
        getAllProducts().then((res) => {
            const allProductsData = res;
            if (allProductsData) {
                setAllProducts(allProductsData);
                setLoading(false);
            } else {
                fetchData();
                setLoading(false);
            }
        });

    }, [temp]);

    // Fetch all user data from the backend API
    const fetchData = async () => {
        try {
            const products = await getAllProducts();
            setAllProducts(products);
            // Save the data in localStorage
            localStorage.setItem('allProductsData', JSON.stringify(products));
        } catch (error) {
            // Handle the error
        }
    };

    const handleRowClick = (params) => {
        console.log('here', params.row);
        setSelectedProduct(params.row);
        setOpenFormDialog(true);
    };
    // console.log(allProducts.id);
    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-cell" },
        { field: "price", headerName: "Price", flex: 1 },
        {
            field: "image",
            headerName: "Image",
            flex: 1,
            renderCell: ({ row }) => (
                <img
                    src={row.image.filePath}
                    alt={row.name}
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "50%" }}
                />
            ),
        },
        { field: "waitingtime", headerName: "Waitingtime", flex: 1 },
        {
            field: "collectlocation",
            headerName: "Collect Location",
            flex: 1,
            cellClassName: "access-cell",
            renderCell: ({ row }) => {
                return (
                    <Box
                        width="60%"
                        m="0px auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            row.collectlocation === 'Kitchen'
                                ? colors.greenAccent[600]
                                : colors.greenAccent[700]
                        }
                        borderRadius="4px"
                        style={{ cursor: 'pointer' }}
                    >
                        {row.collectlocation === 'Kitchen' && <SoupKitchenOutlinedIcon />}
                        {row.collectlocation === 'Bar' && <LocalBarOutlinedIcon />}
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }} >
                            {row.collectlocation}
                        </Typography>
                    </Box>
                );
            },
        },
    ];

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Please enter a product price'),
        waitingtime: Yup.string().required('Please enter a product waiting time'),
        collectlocation: Yup.string().required('Please select a location'),
    });

    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [openFormDialog, setOpenFormDialog] = React.useState(false);

    const formFieldStyles = {
        width: "100%",
        height: "40px",
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "16px",
        outline: "none",
    };

    const handleFormSubmit = async (values) => {
        if (!setSelectedProduct) {
            toast.error("No user selected.");
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("waitingtime", values.waitingtime);
        formData.append("collectlocation", values.collectlocation);
        formData.append("user", user._id)
        try {
            const response = await fetch(`${API}/api/products/${selectedProduct._id}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },

                method: "PATCH",
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                settemp(data);
                toast.success("Product Updated successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Product Updating failed";
                toast.error(errorMessage, {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again.", {
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setOpenFormDialog(false);

    };

    const handleDeleteCategory = async () => {
        if (!selectedProduct) {
            toast.error("No Item selected.");
            return;
        }
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${API}/api/products/${selectedProduct._id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the deleted Product from the state
                setAllProducts((prevProducts) =>
                    prevProducts.filter((product) => product._id !== selectedProduct._id)
                );
                toast.success("Product deleted successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Product deletion failed";
                toast.error(errorMessage, {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again.", {
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setOpenDeleteDialog(false);
        setOpenFormDialog(false);
    };

    return (
        <Box m="20px">
            <Header title="MANAGE FOOD ITEMS" subtitle="Manage Your Food Items" />
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress sx={{
                        position: 'absolute',
                        top: "50%"
                    }} color="secondary" />
                </Box>) : (
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-cell": {
                            color: colors.greenAccent[300],
                        },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: colors.primary[400],
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.blueAccent[700],
                        },
                        "& .MuiDataGrid-panelFooter button": {
                            color: "white !important",
                        },
                    }}
                >
                    <DataGrid
                        rows={allProducts}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 80]}
                        onRowClick={handleRowClick}
                    />
                </Box>
            )
            }

            <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
                <DialogTitle className="dialog-heading">Edit Product Details</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={selectedProduct || {}}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}

                    >
                        {({ values, errors, touched, handleChange }) => (
                            <Form>
                                <Box>
                                    <img width="341" height="341" src={values.image.filePath} alt={values.name} />
                                </Box>
                                <Box my={2}>
                                    <Typography>Name</Typography>
                                    <Field type="text" name="name" style={formFieldStyles} />
                                    {errors.name && touched.name && <Typography>{errors.name}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>Price</Typography>
                                    <Field type="text" name="price" style={formFieldStyles} />
                                    {errors.price && touched.price && <Typography>{errors.price}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>waitingtime</Typography>
                                    <Field type="text" name="waitingtime" style={formFieldStyles} />
                                    {errors.waitingtime && touched.waitingtime && <Typography>{errors.waitingtime}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>Collect Location</Typography>
                                    <Field as="select" name="collectlocation" style={formFieldStyles}>
                                        <option value="">Select Collect Location</option>
                                        <option value="Kitchen">Kitchen</option>
                                        <option value="Bar">Bar</option>
                                    </Field>
                                    {errors.collectlocation && touched.collectlocation && <Typography>{errors.collectlocation}</Typography>}
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between" className="dialog-box-buttons" >
                                    <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
                                    <Button onClick={handleDeleteCategory} color="error">
                                        Delete
                                    </Button>
                                    <Button type="submit">Submit</Button>
                                </Box>
                            </Form>
                        )}

                    </Formik>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this Food?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" alignItems="center" justifyContent="space-between" className="dialog-box-delete">
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error">
                            Delete
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Manageproducts;