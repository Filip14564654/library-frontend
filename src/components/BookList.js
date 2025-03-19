import React, { useEffect, useState } from "react";
import axios from "axios";

function BookList() {
    const [books, setBooks] = useState([]);
    const [editBook, setEditBook] = useState(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [borrowUser, setBorrowUser] = useState("");

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
        axios.put(`http://localhost:8080/api/books/${editBook.id}`, { title, author })
            .then(() => {
                setEditBook(null);
                fetchBooks();
            })
            .catch(error => console.error(error));
    };

    const handleBorrow = (id) => {
        axios.post(`http://localhost:8080/api/books/${id}/borrow?userName=${borrowUser}`)
            .then(() => {
                setBorrowUser("");
                fetchBooks();
            })
            .catch(error => console.error(error));
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
                            {book.available && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Jméno půjčujícího"
                                        value={borrowUser}
                                        onChange={(e) => setBorrowUser(e.target.value)}
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
        </div>
    );
}

export default BookList;
