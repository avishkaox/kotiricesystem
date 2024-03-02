import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';





const Topbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext)
    return (
        <Box display="flex" justifyContent="flex-end" p={2} >
            {/* Icons  */}

            <Box display='flex' className="topbar-icons" >
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <NightsStayIcon />
                    ) : (
                        <WbSunnyIcon />
                    )
                    }

                </IconButton>
                <IconButton>
                    <Link className="login-link" to="/login"> <LogoutIcon /></Link>
                </IconButton>
            </Box>

        </Box>
    )
}

export default Topbar