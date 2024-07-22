import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setRUT } from '../Utils/firestoreUtils';
import './RegisterRUT.css';

const RegisterRUT = () => {
    const { userID } = useParams();
    const [rut, setRutValue] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formatRUT = (rut) => {
        const rutNumber = rut.slice(0, -1);
        const rutVerifier = rut.slice(-1);
        const formattedRUT = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + rutVerifier;
        return formattedRUT;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rut.length < 8 || rut.length > 9) {
            setError('RUT debe tener entre 8 y 9 dígitos.');
            return;
        }
        try {
            const formattedRUT = formatRUT(rut);
            await setRUT(userID, formattedRUT);
            navigate('/'); // Redirigir al dashboard después de guardar el RUT
        } catch (error) {
            console.error('Error al guardar RUT:', error);
            setError('Hubo un error al guardar el RUT. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className="register-rut">
            <div className="form-container">
                <h1>Registro de RUT</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>RUT:</label>
                        <input
                            type="text"
                            value={rut}
                            onChange={(e) => setRutValue(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterRUT;
