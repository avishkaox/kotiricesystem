import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Calendar from "./scenes/calendar";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import Login from "./scenes/user/login";
import Products from "./scenes/produts/Products";
import Createproduct from "./scenes/produts/Createproducts";
import { selectIsLoggedIn } from "./auth/authSlice";
import Manageproducts from "./scenes/produts/Manageproducts";
import Items from "./scenes/items/Items";
import Createitems from "./scenes/items/Createitems";
import Categories from "./scenes/categories/Categories";
import Createcategory from "./scenes/categories/Createcategory";
import { selectUser } from "./auth/authSlice.js";

function App() {
  const [theme, colorMode] = useMode();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Dashboard />
                  </main>
                </div>
              ) : (
                <Login />
              )} />
            <Route
              path="/"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Dashboard />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/team"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Team />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/contacts"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Contacts />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/invoices"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Invoices />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/form"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Form />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/calendar"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Calendar />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/bar"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Bar />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/pie"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Pie />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/line"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Line />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
             <Route
              path="/products"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Products />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/createproduct"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Createproduct />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/manageproduct"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Manageproducts />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/items"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Items />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/createitem"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Createitems />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
            <Route
              path="/categories"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Categories />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
             <Route
              path="/createcategory"
              element={isLoggedIn ? (
                <div className="fullview">
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Createcategory />
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )}
            />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
