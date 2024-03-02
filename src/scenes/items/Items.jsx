import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { getAllItems } from "../../auth/authService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Items = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // State to hold the Item data
    const [allItems, setAllItem] = useState([]);

    const [temp, settemp] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const user = useSelector(selectUser);

    // Get all item data from localStorage or fetch from backend API
    useEffect(() => {
        setLoading(true);
        getAllItems().then((res) => {
            const allItemsData = res;

            if (allItemsData) {
                setAllItem(allItemsData);
            } else {
                fetchData();
            }
            setLoading(false);
        });

    }, [temp]);

    // Fetch all item data from the backend API
    const fetchData = async () => {
        try {
            const items = await getAllItems();

            setAllItem(items);
            // Save the data in localStorage
            localStorage.setItem('allItemsData', JSON.stringify(items));
        } catch (error) {
            // Handle the error
        }
    };

    const handleRowClick = (params) => {
        console.log('here', params.row);
        setSelectedItem(params.row);
        setOpenFormDialog(true);
    };

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-cell" },
        { field: "price", headerName: "Price", flex: 1 },
        { field: "usedby", headerName: "Item Measuring Unit ", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
    ];

    const validationSchema = Yup.object({
        name: Yup.string().required('Item Name is required'),
        price: Yup.number().required('Please provide a price'),
        usedby: Yup.string().required('Please provide an item Measuring Unit ex:g,Kg,ml'),
        quantity: Yup.number().required('Please provide a quantity'),
    });

    const [selectedItem, setSelectedItem] = React.useState(null);
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
        console.log("handleFormSubmit called")
        if (!selectedItem) {
            toast.error("No Item selected.");
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("usedby", values.usedby);
        formData.append("quantity", values.quantity);
        formData.append("user", user._id)    
        try {
            const response = await fetch(`${API}/api/items/${selectedItem._id}`, {
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
                toast.success("Item Updated successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Item Updating failed";
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



    return (
        <Box m="20px">
            <Header title="Stock" subtitle="View all Items" />
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
                        rows={allItems}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 80]}
                        onRowClick={handleRowClick}
                    />
                </Box>
            )
            }

            <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
                <DialogTitle className="dialog-heading">Update Stock Details</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={selectedItem || {}}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}

                    >
                        {({ errors, touched, handleChange }) => (
                            <Form>
                                <Box my={2}>
                                    <Typography>Name</Typography>
                                    <Field type="text" name="name" style={formFieldStyles} />
                                    {errors.name && touched.name && <Typography>{errors.name}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>Price</Typography>
                                    <Field type="number" name="price" style={formFieldStyles} />
                                    {errors.price && touched.price && <Typography>{errors.price}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>Measuring Unit</Typography>
                                    <Field type="text" name="usedby" style={formFieldStyles} />
                                    {errors.usedby && touched.usedby && <Typography>{errors.usedby}</Typography>}
                                </Box>
                                <Box my={2}>
                                    <Typography>Quantity</Typography>
                                    <Field type="number" name="quantity" style={formFieldStyles} />
                                    {errors.quantity && touched.quantity && <Typography>{errors.quantity}</Typography>}
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between" className="dialog-box-buttons" >
                                    <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
                                    <Button type="submit">Submit</Button>
                                </Box>
                            </Form>
                        )}

                    </Formik>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Items;