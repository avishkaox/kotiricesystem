import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import SoupKitchenOutlinedIcon from '@mui/icons-material/SoupKitchenOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/authSlice.js";



const Item = ({ title, to, icon, selected, setSelected }) => {

    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    return (
        <MenuItem
            icon={icon}
            onClick={() => setSelected(title)}
            style={{ color: color.grey[100] }}
            active={selected === title}
        >
            <Typography>
                {title}
            </Typography>
            <Link to={to} />
        </MenuItem>
    )

}


const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const user = useSelector(selectUser);

    const isManager = user.role === "manager";
    const isChef = user.role === "chef";
    const isCashier = user.role === "cashier";

    return (
        <Box
            sx={
                {
                    "& .pro-sidebar-inner": {
                        background: `${colors.primary[400]} !important`,
                    },
                    "& .pro-icon-wrapper": {
                        backgroundColor: "transparent !important"
                    },
                    "& .pro-inner-item": {
                        padding: "5px 35px 5px 20px !important"
                    },
                    "& .pro-inner-item:hover": {
                        color: "#868dfb !important"
                    },
                    "& .pro-menu-item.active": {
                        color: "#6870fa !important"
                    },
                }
            }
        >
            <ProSidebar
                collapsed={isCollapsed}
            >
                <Menu iconShape="square" >
                    {/* Logo and Menu icons  */}
                    <MenuItem
                        onClick={
                            () => {
                                setIsCollapsed(!isCollapsed);
                            }
                        }
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={
                            {
                                margin: "10px 0 20px 0",
                                color: colors.grey[100],
                            }
                        }
                    >
                        {!isCollapsed && (
                            <Box

                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]} >
                                    RMS & POS
                                </Typography>
                                <IconButton onClick={
                                    () => {
                                        setIsCollapsed(!isCollapsed);
                                    }
                                } >
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>
                    {/* User  */}
                    {!isCollapsed && (
                        <Box mb="25px" >

                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
                                <img alt="profile-pic" src={user.image.filePath}
                                    width="100px"
                                    height="100px"
                                    style={{ cursor: "pointer", borderRadius: "50%" }}

                                />
                                <Box textAlign="center" >
                                    <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }} > {user.name}</Typography>
                                    <Typography variant="h5" color={colors.greenAccent[500]} textTransform="capitalize"  > {user.role} </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Menue Items  */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"} >

                        {isChef && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Data</Typography>

                                <Item
                                    title="Ongoing Orders"
                                    to="/invoices"
                                    icon={<ReceiptOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}
                        {isCashier && (
                            <>
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Food Items</Typography>

                                <Item
                                    title="Foods"
                                    to="/products"
                                    icon={<FoodBankOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {!isChef && !isCashier && (
                            <>
                                <Item
                                    title="Dashboard"
                                    to="/"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}

                                >Data</Typography>

                                <Item
                                    title="Manage Team"
                                    to="/team"
                                    icon={<PeopleOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Contacts Information"
                                    to="/contacts"
                                    icon={<ContactsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Ongoing Orders"
                                    to="/invoices"
                                    icon={<ReceiptOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Food Items</Typography>

                                <Item
                                    title="Foods"
                                    to="/products"
                                    icon={<FoodBankOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Create New Food Item"
                                    to="/createproduct"
                                    icon={<RestaurantOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Manage Food Items"
                                    to="/manageproduct"
                                    icon={<SoupKitchenOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Items</Typography>

                                <Item
                                    title="Inventory"
                                    to="/items"
                                    icon={<ChecklistOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Item
                                    title="Create New Items"
                                    to="/createitem"
                                    icon={<EditNoteOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Categories</Typography>

                                <Item
                                    title="Categories"
                                    to="/categories"
                                    icon={<CategoryOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Item
                                    title="Create New Category"
                                    to="/createcategory"
                                    icon={<ModeEditOutlineOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Pages</Typography>

                                <Item
                                    title="Create New User"
                                    to="/form"
                                    icon={<PersonOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "15px 0 5px 20px" }}
                                >Charts</Typography>
                                <Item
                                    title="Bar Chart"
                                    to="/bar"
                                    icon={<BarChartOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Pie Chart"
                                    to="/pie"
                                    icon={<PieChartOutlineOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}


                    </Box>


                </Menu>

            </ProSidebar>


        </Box>

    )
}

export default Sidebar