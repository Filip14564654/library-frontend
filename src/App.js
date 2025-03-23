import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import LoanList from "./components/LoanList";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">📚 Knihy</Link>
                <Link to="/add-book">➕ Přidat knihu</Link>
                <Link to="/loans">📜 Výpůjčky</Link>
            </nav>

            <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/add-book" element={<BookForm />} />
                <Route path="/loans" element={<LoanList />} />
            </Routes>
        </Router>
    );
}

export default App;
