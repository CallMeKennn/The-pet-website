import "./App.scss";
import { pages } from "./Resource/resource";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {pages.map((page, index) => {
                        const Page = page.page;
                        return (
                            <Route
                                key={index}
                                path={page.path}
                                element={
                                    page.path === "/" ? (
                                        <Page isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                                    ) : page.path === "/doctor" ? (
                                        // isLoggedIn ? (
                                        //     <Page />
                                        // ) : (
                                        //     <Navigate to="/" />
                                        // )
                                        <Page />
                                    ) : (
                                        <Page />
                                    )
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
