import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";

function BookForm({ refreshBooks }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/books", { title, author })
      .then(() => {
        setTitle("");
        setAuthor("");
        if (refreshBooks) refreshBooks();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        ➕ Přidat knihu
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 2, maxWidth: 400, mx: "auto" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField
            label="Název knihy"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Autor"
            variant="outlined"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Přidat
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default BookForm;
