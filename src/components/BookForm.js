import React, { useState } from "react";
import axios from "axios";

function BookForm({ refreshBooks }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/books", { title, author })
            .then(() => {
                setTitle("");
                setAuthor("");
                // refreshBooks();
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>➕ Přidat knihu</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Název knihy" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <button type="submit">Přidat</button>
            </form>
        </div>
    );
}

export default BookForm;
