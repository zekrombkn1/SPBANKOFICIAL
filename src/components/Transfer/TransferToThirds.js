import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransferToThirds.css';  // Assuming your CSS is saved in styles.css

const TransferToThirds = () => {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isUserFound, setIsUserFound] = useState(false);

  useEffect(() => {
    // Simulate fetching balances or any required data on mount
    // fetchBalances();

    // This is just for demonstration
    if (!navigate) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFindUser = () => {
    if (rut === '12345678-9') {
      setIsUserFound(true);
      setError('');
    } else {
      setError('RUT not found. Please check and try again.');
      setIsUserFound(false);
    }
  };

  const handleTransfer = () => {
    if (!amount || !rut) {
      setError('Please complete all fields.');
      return;
    }

    if (amount > 100) {
      setError('Insufficient funds in the origin account.');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="transfer">
      <div className="form-container">
        <h1>Transfer to Third Parties</h1>
        <div className="form-group">
          <label>
            Recipient RUT:
            <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} />
          </label>
          <button type="button" onClick={handleFindUser}>Find User</button>
        </div>
        {isUserFound && (
          <div className="form-group">
            <label>
              Amount:
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <button type="button" onClick={handleTransfer}>Transfer</button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default TransferToThirds;
