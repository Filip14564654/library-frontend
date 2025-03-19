import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LoanList() {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/loans')
            .then(response => setLoans(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>📜 Aktuální výpůjčky</h2>
            <ul>
                {loans.map(loan => (
                    <li key={loan.id}>
                        {loan.book.title} půjčeno {loan.userName} dne {loan.loanDate}
                        {loan.returnDate ? ` (Vráceno ${loan.returnDate})` : " 📌 Nevraćeno"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LoanList;
