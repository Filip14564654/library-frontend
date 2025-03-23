import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Alert
} from "@mui/material";

function LoanList() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = () => {
    axios
      .get("http://localhost:8080/api/loans")
      .then((response) => setLoans(response.data))
      .catch((error) =>
        console.error("❌ Chyba při načítání výpůjček:", error)
      );
  };

  const returnBook = (loanId) => {
    axios
      .put(`http://localhost:8080/api/loans/return/${loanId}`)
      .then(() => fetchLoans())
      .catch((error) =>
        console.error("❌ Chyba při vracení knihy:", error)
      );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📜 Správa výpůjček
      </Typography>
      {loans.length === 0 ? (
        <Alert severity="info">Žádné aktivní výpůjčky.</Alert>
      ) : (
        <Grid container spacing={2}>
          {loans.map((loan) => (
            <Grid item xs={12} md={6} key={loan.id}>
              <Card variant="outlined">
                <CardContent>
                  {loan.book ? (
                    <>
                      <Typography variant="h6">📖 {loan.book.title}</Typography>
                      <Typography>
                        Vypůjčil: <strong>{loan.userName}</strong>
                      </Typography>
                      <Typography>
                        Datum výpůjčky: {loan.loanDate}
                      </Typography>
                      {loan.returnDate ? (
                        <Typography color="success.main">
                          ✅ Vráceno dne {loan.returnDate}
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => returnBook(loan.id)}
                          sx={{ mt: 1 }}
                        >
                          🔄 Vrátit knihu
                        </Button>
                      )}
                    </>
                  ) : (
                    <Alert severity="error">⚠️ Chyba: Kniha není dostupná</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default LoanList;
