import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import LoanList from "./components/LoanList";
import { AppBar, Toolbar, Button, Container } from "@mui/material";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/" color="inherit">
            📚 Knihy
          </Button>
          <Button component={Link} to="/add-book" color="inherit">
            ➕ Přidat knihu
          </Button>
          <Button component={Link} to="/loans" color="inherit">
            📜 Výpůjčky
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/add-book" element={<BookForm />} />
          <Route path="/loans" element={<LoanList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;