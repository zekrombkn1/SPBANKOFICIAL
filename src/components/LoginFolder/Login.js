import React from 'react';
import { auth, provider } from '../../config/firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { createAccount } from '../Utils/firestoreUtils'; // Import createAccount function
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async (isRegister = false) => {
        try {
            const results = await signInWithPopup(auth, provider);
            const userID = results.user.uid;
            const userDoc = doc(db, 'users', userID);
            const docSnap = await getDoc(userDoc);

            if (isRegister) {
                if (docSnap.exists()) {
                    alert("User already has an account. Please log in.");
                    return;
                } else {
                    await setDoc(userDoc, {
                        name: results.user.displayName,
                        email: results.user.email,
                        profilePhoto: results.user.photoURL
                    });
                    await createAccount(userID, 'checking', 20000); // Create checking account with initial balance
                    navigate(`/register-rut/${userID}`);
                    return;
                }
            } else {
                if (!docSnap.exists()) {
                    alert("User does not have an account. Please register first.");
                    return;
                }
            }

            const authInfo = {
                userID: userID,
                name: results.user.displayName,
                profilePhoto: results.user.photoURL,
                isAuth: true,
            };

            localStorage.setItem("auth", JSON.stringify(authInfo));
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during authentication: ", error);
        }
    };

    return (
        <div className="login-page">
            <div className="title-container">
                <h1 className="bank-title">SPBank</h1>
                <p className="bank-subtitle">Your trust bank</p>
            </div>
            <div className="login-card">
                <p>Sign in with Google to Continue</p>
                <button className="btn btn-primary login-with-google-btn" onClick={() => signInWithGoogle(false)}>
                    Login with Google
                </button>
                <button className="btn btn-success mt-3 register-with-google-btn" onClick={() => signInWithGoogle(true)}>
                    Register with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
