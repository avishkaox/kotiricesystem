import { createSlice } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
    isLoggedIn: false,
    Test: false,
    name: name ? name : "",
    user: {
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        registerid: "",
        image: null,
        _id: null
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_LOGIN: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        SET_NAME(state, action) {
            localStorage.setItem("name", JSON.stringify(action.payload));
            state.name = action.payload;
        },
        SET_USER(state, action) {
            const profile = action.payload;
            state.user.name = profile.name;
            state.user.email = profile.email;
            state.user.phone = profile.phone;
            state.user.role = profile.role;
            state.user.registerid = profile.registerid;
            state.user.image = profile.image;
            state.user._id = profile._id;
        },
        SET_ALL_USERS(state, action) {
            state.allUsers = action.payload;
        },
        SET_ALL_PRODUCTS(state, action) {
            state.allProducts = action.payload;
            localStorage.setItem("allProducts", JSON.stringify(action.payload));
        },
        SET_ALL_ITEMS(state, action) {
            state.allItems = action.payload;
            localStorage.setItem("allItems", JSON.stringify(action.payload));
        },
        SET_ALL_CATEGORIES(state, action) {
            state.allCategories = action.payload;
            localStorage.setItem("allCategories", JSON.stringify(action.payload));
        },
        CLEAR_ALL_USERS(state, action) {
            state = initialState;
        },
        SET_ALL_PRRDUCTSFORPIECHART(state, action) {
            state.productsforPieChart = action.payload;
            localStorage.setItem("productsforPieChart", JSON.stringify(action.payload));
        },
        SET_ALL_ITEMSFORBARCHART(state, action) {
            state.itemsforBarChart = action.payload;
            localStorage.setItem("itemsforBarChart", JSON.stringify(action.payload));
        },
        SET_ALL_PURCHASEDPRODUCTS(state, action) {
            state.allPurchasedProducts = action.payload;
            localStorage.setItem("allPurchasedProducts", JSON.stringify(action.payload));
        },
    },
});





export const { SET_LOGIN, SET_NAME, SET_USER, SET_ALL_USERS, SET_ALL_PRODUCTS, SET_ALL_ITEMS, SET_ALL_CATEGORIES, CLEAR_ALL_USERS, SET_ALL_PRRDUCTSFORPIECHART, SET_ALL_ITEMSFORBARCHART, SET_ALL_PURCHASEDPRODUCTS } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;
export const selectAllUsers = (state) => state.auth.allUsers;
export const selectAllProducts = (state) => state.auth.allProducts;
export const selectAllItems = (state) => state.auth.allItems;
export const selectAllCategories = (state) => state.auth.allCategories;
export const selectAllCProductsForPieChart = (state) => state.auth.productsforPieChart;
export const selectAllCItemsForBarChart = (state) => state.auth.itemsforBarChart;
export const selectPurchasedProducts = (state) => state.auth.PurchasedProducts;

export default authSlice.reducer;
