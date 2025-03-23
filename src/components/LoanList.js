import React, { useEffect, useState } from "react";
import axios from "axios";

function LoanList() {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        console.log("📡 Spouštím načítání výpůjček...");
        fetchLoans();
    }, []);

    const fetchLoans = () => {
        console.log("🔍 Posílám request na API...");
        axios.get("http://localhost:8080/api/loans")
            .then(response => {
                console.log("📜 API odpověď:", response.data); // ✅ Log API response
                setLoans(response.data);
            })
            .catch(error => console.error("❌ Chyba při načítání výpůjček:", error));
    };

    const returnBook = (loanId) => {
        console.log(`🔄 Vrácení knihy ID: ${loanId}`);
        axios.put(`http://localhost:8080/api/loans/return/${loanId}`)
            .then(() => {
                console.log(`✅ Kniha ID ${loanId} vrácena`);
                fetchLoans(); // Refresh the list after returning the book
            })
            .catch(error => console.error("❌ Chyba při vracení knihy:", error));
    };

    return (
        <div>
            <h2>📜 Správa výpůjček</h2>
            {loans.length === 0 ? <p>Žádné aktivní výpůjčky.</p> : (
                <ul>
                    {loans.map(loan => (
                        <li key={loan.id}>
                            {loan.book ? (
                                <>
                                    📖 <strong>{loan.book.title}</strong> vypůjčil {loan.userName} dne {loan.loanDate}
                                    {loan.returnDate ? (
                                        <span> ✅ Vráceno dne {loan.returnDate}</span>
                                    ) : (
                                        <button onClick={() => returnBook(loan.id)}>🔄 Vrátit knihu</button>
                                    )}
                                </>
                            ) : (
                                <span>⚠️ Chyba: Kniha není dostupná</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LoanList;
