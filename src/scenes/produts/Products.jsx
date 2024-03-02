import Header from "../../components/Header";
import { Box, Card, CardContent, CardMedia, Grid, Typography, Pagination, Button, CircularProgress, TextField } from "@mui/material";
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import React, { useEffect, useState } from 'react';
import { tokens } from "../../theme";
import { useMode } from "../../theme";
import { toast } from "react-toastify";
import { getAllProducts, getAllCategories, purchaseProduct } from "../../auth/authService.js";

const Products = () => {
    // Using the useMode hook to get the theme and color mode
    const [theme] = useMode(); // Ensure the hook is returning the theme properly
    const colors = tokens(theme.palette.mode);

    // State to hold the all products data
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(""); // New state for search keyword

    // Get all product data from localStorage or fetch from backend API
    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    // Fetch all product data from the backend API
    const fetchData = async () => {
        try {
            const products = await getAllProducts();
            setAllProducts(products);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch all product Categories from the backend API
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const categories = await getAllCategories();
            setAllCategories(categories);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const cardsPerPage = 12; // Number of cards to display per page
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleShowAll = () => {
        setSelectedCategory(null);
        setSearchKeyword("");
    };

    // Filter products based on the selected category and search keyword
    const filteredProducts = allProducts.filter((product) => {
        const categoryMatch = !selectedCategory || product.category.name === selectedCategory.name;
        const keywordMatch = product.name.toLowerCase().includes(searchKeyword.toLowerCase());
        return categoryMatch && keywordMatch;
    });

    const totalCards = filteredProducts.length;
    const totalPages = Math.ceil(totalCards / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;



    // State to hold the selected products and their quantities
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Function to handle adding a product to the selectedProducts list
    const handleAddToCart = (product) => {
        const productAlreadyAdded = selectedProducts.find(
            (item) => item.product.id === product.id
        );

        if (productAlreadyAdded) {
            // Product already in the cart, update the quantity
            const updatedProducts = selectedProducts.map((item) =>
                item.product.id === product.id
                    ? { product: item.product, quantity: item.quantity + 1 }
                    : item
            );
            setSelectedProducts(updatedProducts);
        } else {
            // Product not in the cart, add it with a default quantity of 1
            setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
        }
    };

    // Function to handle changing the quantity of a selected product
    const handleChangeQuantity = (product, newQuantity) => {
        const updatedProducts = selectedProducts.map((item) =>
            item.product.id === product.id
                ? { product: item.product, quantity: newQuantity }
                : item
        );
        setSelectedProducts(updatedProducts);
    };

    // Function to handle removing a product from the selectedProducts list
    const handleRemoveFromCart = (product) => {
        const updatedProducts = selectedProducts.filter(
            (item) => item.product.id !== product.id
        );
        setSelectedProducts(updatedProducts);
    };

    // Function to calculate the total price of all selected products
    const calculateTotalPrice = () => {
        return selectedProducts.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    // Function to handle confirming the order
    const handleConfirmOrder = async () => {
        // Call the purchaseProduct API for each selected product
        for (const item of selectedProducts) {
            const { product, quantity } = item;
            // console.log(product);
            try {
                // Make a POST request to the purchaseProduct API for each product
                // Pass the product ID and the quantity to the API
                await purchaseProduct(product._id, { quantity });
                console.log(`Order for product "${product.name}" with quantity ${quantity} confirmed.`);

                toast.success(`Order for product "${product.name}" with quantity ${quantity} confirmed.`, {
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch (error) {
                console.error(`Error confirming order for product "${product.name}":`, error);
                // Handle error or show an error message to the user
            }
        }

        // Clear the selectedProducts list after confirming the order
        setSelectedProducts([]);
    };

    const renderSelectedProducts = () => {
        return (
            <Box>
                {selectedProducts.map((item) => (
                    <Box display="flex" flexDirection="row" alignItems="center" paddingLeft="15px" key={item.product.id}>
                        <Typography variant="h4">{item.product.name}</Typography>
                        <TextField
                            className="quantity-inputfield"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleChangeQuantity(item.product, parseInt(e.target.value))}
                        />
                        <Button onClick={() => handleRemoveFromCart(item.product)}>Remove</Button>
                    </Box>
                ))}
                <Typography variant="h6">Total Price: {calculateTotalPrice()} Rs</Typography>
                <Button onClick={handleConfirmOrder}>Confirm Order</Button>
            </Box>
        );
    };

    // State to hold the visibility of the cart section
    const [isCartVisible, setCartVisible] = useState(false);

    // Function to toggle the visibility of the cart section
    const handleToggleCart = () => {
        setCartVisible((prevState) => !prevState);
    };


    return (
        <Box m="20px">
            <Header title="FOOD ITEMS" subtitle="View all Food Items" />
            <Box display="flex" justifyContent="space-between" flexDirection="row" >
                <TextField className="foodsearch"
                    label="Search products"
                    variant="outlined"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {/* Toggle Button */}
                <Box className="orderboxtoggle" ml={2} mt={5}>
                    <Button onClick={handleToggleCart} variant="contained">
                        {isCartVisible ? "Hide Orders" : "Show Orders"}
                    </Button>
                </Box>
            </Box>
            <Box className="categories" display="block" my={2}>
                <Button
                    onClick={handleShowAll}
                    sx={{ margin: 1 }}
                >
                    Show All
                </Button>
                {allCategories.map((category) => (
                    <Button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        sx={{ margin: 1 }}
                    >
                        {category.name}
                    </Button>
                ))}
            </Box>

            <Box>
                <Box display="block">
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress sx={{
                                position: 'absolute',
                                top: "50%"
                            }} color="secondary" />
                        </Box>
                    ) : (
                        <Box className="cardgrid" >
                            <Grid container spacing={2}>
                                {filteredProducts.slice(startIndex, endIndex).map((product) => (
                                    <Grid item key={product.id} xs={12} sm={6} md={3}>
                                        <Card sx={{ backgroundColor: colors.greenAccent[600] }} >
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={product.image?.filePath}
                                                alt="Card Image"
                                            />
                                            <CardContent>
                                                <Box display="flex" flexDirection="row"
                                                    alignItems="center"
                                                    justifyContent="space-between" paddingBottom="19px"  >
                                                    <Typography variant="h3">
                                                        {product.name}
                                                    </Typography>
                                                    <Box display="flex" flexDirection="row"
                                                        alignItems="stretch">
                                                        <Typography variant="h5">
                                                            :{product.price}Rs
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" >
                                                    <Box display="flex" flexDirection="row"
                                                        alignItems="stretch">
                                                        <AccessTimeFilledOutlinedIcon />
                                                        <Typography variant="h5">
                                                            : {product.waitingtime}Minutes
                                                        </Typography>
                                                    </Box>
                                                    <Button onClick={() => handleAddToCart(product)} variant="contained" sx={{ color: "white", fontSize: "15px" }} color="success">
                                                        ORDER
                                                    </Button>
                                                </Box>
                                                <Box className="collectlocation">
                                                    Collect Location : {product.collectlocation}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Pagination
                                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </Box>
                <Box className="orderbox">
                    {/* Cart Section */}
                    {isCartVisible && (
                        <Box className="order" flex="1">
                            <Box mt={5} ml={3}>
                                <Typography variant="h5">Ongoing Food Orders</Typography>
                            </Box>
                            {renderSelectedProducts()}
                        </Box>
                    )}
                </Box>
            </Box>

        </Box>
    );
};

export default Products;
