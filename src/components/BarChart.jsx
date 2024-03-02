// import { useTheme } from "@emotion/react";
import { ResponsiveBar } from "@nivo/bar";
import React, { useEffect, useState } from 'react';
import { getAllItemsforBarChart } from "../auth/authService";

const BarChart = ({ isDashboard = false }) => {



    // State to hold the all products data
    const [data, setAllItemsForBarChart] = useState([]);

    // Get all product data from localStorage or fetch from backend API
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all product data from the backend API
    const fetchData = async () => {
        try {
            const data = await getAllItemsforBarChart();
            setAllItemsForBarChart(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ResponsiveBar
            data={data}
            keys={['value']}
            indexBy="id"
            colorBy="indexValue"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            axisBottom={null}
            colors={{ scheme: 'paired' }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
            }}
            enableGridX={false}
            enableGridY={false}
        />
    )

}

export default BarChart