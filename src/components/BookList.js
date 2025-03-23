import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box
} from "@mui/material";

function BookList() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [borrowUsers, setBorrowUsers] = useState({});
  const [loanHistory, setLoanHistory] = useState([]);
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get("http://localhost:8080/api/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("❌ Chyba při načítání knih:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/books/${id}`)
      .then(() => fetchBooks())
      .catch((error) => console.error(error));
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  const handleUpdate = () => {
    if (!editBook) return;

    const updatedBook = {
      title: title,
      author: author
    };

    axios
      .put(
        `http://localhost:8080/api/books/${editBook.id}`,
        JSON.stringify(updatedBook),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(() => {
        setEditBook(null);
        fetchBooks();
      })
      .catch((error) => console.error("❌ Error updating book:", error));
  };

  const handleBorrowChange = (bookId, value) => {
    setBorrowUsers((prevState) => ({
      ...prevState,
      [bookId]: value
    }));
  };

  const handleBorrow = (bookId) => {
    const userName = borrowUsers[bookId] || "";
    if (!userName.trim()) {
      alert("❌ Zadejte jméno půjčujícího.");
      return;
    }

    axios
      .post(
        `http://localhost:8080/api/books/borrow/${bookId}?userName=${userName}`
      )
      .then(() => {
        setBorrowUsers((prevState) => ({ ...prevState, [bookId]: "" }));
        fetchBooks();
      })
      .catch((error) =>
        console.error("❌ Chyba při půjčování knihy:", error)
      );
  };

  const handleShowHistory = (bookId, bookTitle) => {
    axios
      .get(`http://localhost:8080/api/loans/history/${bookId}`)
      .then((response) => {
        setLoanHistory(response.data);
        setSelectedBookTitle(bookTitle);
        setShowModal(true);
      })
      .catch((error) =>
        console.error("❌ Chyba při načítání historie výpůjček:", error)
      );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📚 Seznam knih
      </Typography>
      {books.length === 0 ? (
        <Typography>Žádné knihy nebyly nalezeny.</Typography>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} md={6} key={book.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="text.secondary">{book.author}</Typography>
                  <Typography>
                    Stav: <span style={{ color: book.available ? "green" : "red" }}>
                      {book.available ? "Dostupná" : "Vypůjčená"}
                    </span>
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button variant="contained" onClick={() => handleEdit(book)}>
                      ✏️ Upravit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(book.id)}>
                      🗑️ Smazat
                    </Button>
                    <Button variant="outlined" onClick={() => handleShowHistory(book.id, book.title)}>
                      📜 Historie
                    </Button>
                  </Box>
                  {book.available && (
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      <TextField
                        label="Jméno půjčujícího"
                        variant="outlined"
                        value={borrowUsers[book.id] || ""}
                        onChange={(e) => handleBorrowChange(book.id, e.target.value)}
                      />
                      <Button variant="contained" onClick={() => handleBorrow(book.id)}>
                        📖 Půjčit
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {editBook && (
        <Box sx={{ mt: 4, maxWidth: 400 }}>
          <Typography variant="h6">✏️ Úprava knihy</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Název knihy"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleUpdate}>
              💾 Uložit
            </Button>
            <Button variant="outlined" onClick={() => setEditBook(null)}>
              ❌ Zrušit
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>📜 Historie výpůjček: {selectedBookTitle}</DialogTitle>
        <DialogContent>
          {loanHistory.length === 0 ? (
            <Typography>Žádná výpůjčka</Typography>
          ) : (
            <ul>
              {loanHistory.map((loan) => (
                <li key={loan.id}>
                  {loan.userName} – {loan.loanDate} {loan.returnDate ? `→ ${loan.returnDate}` : "(nevráceno)"}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default BookList;
