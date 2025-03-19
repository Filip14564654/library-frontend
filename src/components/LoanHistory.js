import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LoanHistory({ bookId }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/loans/history/${bookId}`)
            .then(response => setHistory(response.data))
            .catch(error => console.error(error));
    }, [bookId]);

    return (
        <div>
            <h2>📖 Historie výpůjček</h2>
            <ul>
                {history.map(loan => (
                    <li key={loan.id}>
                        {loan.userName} vypůjčil dne {loan.loanDate}
                        {loan.returnDate ? ` a vrátil dne ${loan.returnDate}` : " 📌 Dosud nevráceno"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LoanHistory;
