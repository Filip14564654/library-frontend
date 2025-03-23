import React, { useEffect, useState } from "react";
import axios from "axios";

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
        axios.get("http://localhost:8080/api/books")
            .then(response => setBooks(response.data))
            .catch(error => console.error("❌ Chyba při načítání knih:", error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/books/${id}`)
            .then(() => fetchBooks())
            .catch(error => console.error(error));
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

        axios.put(`http://localhost:8080/api/books/${editBook.id}`,
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
            .catch(error => console.error("❌ Error updating book:", error));
    };

    const handleBorrowChange = (bookId, value) => {
        setBorrowUsers(prevState => ({
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

        axios.post(`http://localhost:8080/api/books/borrow/${bookId}?userName=${userName}`)
            .then(() => {
                setBorrowUsers(prevState => ({ ...prevState, [bookId]: "" }));
                fetchBooks();
            })
            .catch(error => console.error("❌ Chyba při půjčování knihy:", error));
    };

    const handleShowHistory = (bookId, bookTitle) => {
        axios.get(`http://localhost:8080/api/loans/history/${bookId}`)
            .then(response => {
                setLoanHistory(response.data);
                setSelectedBookTitle(bookTitle);
                setShowModal(true);
            })
            .catch(error => console.error("❌ Chyba při načítání historie výpůjček:", error));
    };

    return (
        <div>
            <h2>📚 Seznam knih</h2>
            {books.length === 0 ? <p>Žádné knihy nebyly nalezeny.</p> : (
                <ul>
                    {books.map(book => (
                        <li key={book.id}>
                            {book.title} - {book.author} ({book.available ? "Dostupná" : "Vypůjčená"})
                            <button onClick={() => handleEdit(book)}>✏️ Upravit</button>
                            <button onClick={() => handleDelete(book.id)}>🗑️ Smazat</button>
                            <button onClick={() => handleShowHistory(book.id, book.title)}>📜 Historie výpůjček</button>
                            {book.available && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Jméno půjčujícího"
                                        value={borrowUsers[book.id] || ""}
                                        onChange={(e) => handleBorrowChange(book.id, e.target.value)}
                                    />
                                    <button onClick={() => handleBorrow(book.id)}>📖 Půjčit</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {editBook && (
                <div>
                    <h3>✏️ Úprava knihy</h3>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <button onClick={handleUpdate}>💾 Uložit</button>
                    <button onClick={() => setEditBook(null)}>❌ Zrušit</button>
                </div>
            )}

            {/* Modal s historií výpůjček */}
            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", maxWidth: "500px" }}>
                        <h3>📜 Historie výpůjček: {selectedBookTitle}</h3>
                        {loanHistory.length === 0 ? (
                            <p>Žádná výpůjčka</p>
                        ) : (
                            <ul>
                                {loanHistory.map(loan => (
                                    <li key={loan.id}>
                                        {loan.userName} – {loan.loanDate} {loan.returnDate ? `→ ${loan.returnDate}` : "(nevráceno)"}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button onClick={() => setShowModal(false)}>Zavřít</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookList;
