import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { getAllUser } from "../../auth/authService.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";
import { API } from "../../config.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // current logged user 
  const userNeedToRemove = useSelector(selectUser);
  // console.log(userNeedToRemove.email)

  // State to hold the allUsers data
  const [allUsers, setAllUser] = useState([]);

  const [temp, settemp] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Get all user data from localStorage or fetch from backend API
  useEffect(() => {
    setLoading(true);
    getAllUser().then((res) => {
      const allUsersData = res;

      const updatedAllUsers = allUsersData.filter(user => user.email !== userNeedToRemove.email);

      if (updatedAllUsers) {
        setAllUser(updatedAllUsers);
      } else {
        fetchData();
      }
      setLoading(false);
    });

  }, [temp]);

  // Fetch all user data from the backend API
  const fetchData = async () => {
    try {
      const users = await getAllUser();

      // Remove loged user from the list 

      const updatedAllUserss = users.filter(user => user.email !== userNeedToRemove.email);

      setAllUser(updatedAllUserss);
      // Save the data in localStorage
      localStorage.setItem('updatedAllUsers', JSON.stringify(users));
    } catch (error) {
      // Handle the error
    }
  };

  const handleRowClick = (params) => {
    console.log('here', params.row);
    setSelectedUser(params.row);
    setOpenFormDialog(true);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-cell" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "registerid", headerName: "Register Id", flex: 1 },
    {
      field: "role",
      headerName: "Access Level",
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
              row.role === 'manager'
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
            style={{ cursor: 'pointer' }}
          >
            {row.role === 'manager' && <AdminPanelSettingsOutlinedIcon />}
            {row.role === 'employee' && <PersonOutlineOutlinedIcon />}
            {row.role === 'cashier' && <PointOfSaleOutlinedIcon />}
            {row.role === 'chef' && <LocalDiningOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }} >
              {row.role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone Number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    registerid: Yup.string().required('Register Id is required'),
    role: Yup.string().required('Access Level is required'),
  });

  const [selectedUser, setSelectedUser] = React.useState(null);
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
    if (!selectedUser) {
      toast.error("No user selected.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("role", values.role);
    try {
      const response = await fetch(`${API}/api/users/updateuser/${selectedUser._id}`, {
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
        toast.success("User Updated successfully!", {
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "User Updating failed";
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
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setOpenFormDialog(false);

  };

  // let chart = []


  // test.map(() => {
  //   chart.push({
  //     "id": "scala",
  //     "label": "scala",
  //     "value": 513,
  //     "color": "hsl(347, 70%, 50%)"
  //       })
  // })



  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the team Members" />
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
            rows={allUsers}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 80]}
            onRowClick={handleRowClick}
          />
        </Box>
      )
      }

      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle className="dialog-heading">Edit User Details</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={selectedUser || {}}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}

          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Box my={2}>
                  <Typography>Name</Typography>
                  <Field type="text" name="name" style={formFieldStyles} />
                  {errors.name && touched.name && <Typography>{errors.name}</Typography>}
                </Box>
                <Box my={2}>
                  <Typography>Phone Number</Typography>
                  <Field type="text" name="phone" style={formFieldStyles} />
                  {errors.phone && touched.phone && <Typography>{errors.phone}</Typography>}
                </Box>
                <Box my={2}>
                  <Typography>Email</Typography>
                  <Field type="email" name="email" style={formFieldStyles} />
                  {errors.email && touched.email && <Typography>{errors.email}</Typography>}
                </Box>
                <Box my={2}>
                  <Typography>Access Level</Typography>
                  <Field as="select" name="role" style={formFieldStyles}>
                    <option value="">Select Access Level</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="cashier">Cashier</option>
                    <option value="chef">Chef</option>
                  </Field>
                  {errors.role && touched.role && <Typography>{errors.role}</Typography>}
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
};

export default Team;
