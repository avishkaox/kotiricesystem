import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { getAllCategories } from "../../auth/authService.js";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // State to hold the Category data
    const [allCategory, setAllCategory] = useState([]);
    const [temp, settemp] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Get all Category data from localStorage or fetch from backend API
    useEffect(() => {
        setLoading(true);
        getAllCategories().then((res) => {
            const allCategoriesData = res;
            if (allCategoriesData) {
                setAllCategory(allCategoriesData);
            } else {
                fetchData();
            }
            setLoading(false);
        });
    }, [temp]);

    // Fetch all Category data from the backend API
    const fetchData = async () => {
        try {
            const categories = await getAllCategories();
            setAllCategory(categories);
            // Save the data in localStorage
            localStorage.setItem('allCategoriesData', JSON.stringify(categories));
        } catch (error) {
            // Handle the error
        }
    };

    const handleRowClick = (params) => {
        setSelectedCategory(params.row);
        setOpenFormDialog(true);
    };

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-cell" }
    ];

    const validationSchema = Yup.object({
        name: Yup.string().required('Item Name is required')
    });

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
        if (!selectedCategory) {
            toast.error("No Item selected.");
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        try {
            const response = await fetch(`${API}/api/categories/${selectedCategory._id}`, {
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
                toast.success("Category Updated successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Category Updating failed";
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
        if (!selectedCategory) {
            toast.error("No Item selected.");
            return;
        }
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${API}/api/categories/${selectedCategory._id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the deleted category from the state
                setAllCategory((prevCategories) =>
                    prevCategories.filter((category) => category._id !== selectedCategory._id)
                );
                toast.success("Category deleted successfully!", {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Category deletion failed";
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
            <Header title="CATEGORIES" subtitle="View all Categories" />
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
                        rows={allCategory}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 80]}
                        onRowClick={handleRowClick}
                    />
                </Box>
            )
            }

            <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
                <DialogTitle className="dialog-heading">Update Category Details</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={selectedCategory || {}}
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
                        Are you sure you want to delete this category?
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
};

export default Categories;
