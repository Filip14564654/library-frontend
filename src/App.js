import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import { useState } from "react";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">📚 Knihy</Link>
                <Link to="/add-book">➕ Přidat knihu</Link>
            </nav>

            <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/add-book" element={<BookForm />} />
            </Routes>
        </Router>
    );
}

export default App;
