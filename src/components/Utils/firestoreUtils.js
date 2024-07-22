// src/components/Utils/firestoreUtils.js
import { db } from "../../config/firebase-config";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Function to check if an account exists
export const accountExists = async (userID, accountType) => {
    const accountRef = doc(db, 'users', userID, 'accounts', accountType);
    const accountSnap = await getDoc(accountRef);
    return accountSnap.exists();
};

// Function to create a new account with an initial balance
export const createAccount = async (userID, accountType, initialBalance = 20000) => {
    const accountRef = doc(db, 'users', userID, 'accounts', accountType);
    await setDoc(accountRef, { balance: initialBalance });
};

// Function to update account balance
export const updateAccountBalance = async (userID, accountType, newBalance) => {
    const accountRef = doc(db, 'users', userID, 'accounts', accountType);
    await updateDoc(accountRef, { balance: newBalance });
};

// Function to get account balance
export const getAccountBalance = async (userID, accountType) => {
    const accountRef = doc(db, 'users', userID, 'accounts', accountType);
    const accountSnap = await getDoc(accountRef);
    if (accountSnap.exists()) {
        return accountSnap.data().balance;
    } else {
        throw new Error(`${accountType} account does not exist.`);
    }
};

// Function to create a payment
export const createPayment = async (userID, paymentName, amount) => {
    const paymentRef = collection(db, 'users', userID, 'payments');
    await addDoc(paymentRef, { name: paymentName, amount, date: new Date() });
};

// Function to get payments
export const getPayments = async (userID) => {
    const paymentsRef = collection(db, 'users', userID, 'payments');
    const paymentsQuery = query(paymentsRef);
    const paymentsSnap = await getDocs(paymentsQuery);
    const payments = [];
    paymentsSnap.forEach((doc) => {
        payments.push(doc.data());
    });
    return payments;
};

// Function to find a user by their RUT
export const findUserByRUT = async (rut) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("rut", "==", rut));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    } else {
        return null;
    }
};

// Function to transfer funds
export const transferFunds = async (fromUserID, toUserID, amount) => {
    const fromAccountRef = doc(db, 'users', fromUserID, 'accounts', 'checking');
    const toAccountRef = doc(db, 'users', toUserID, 'accounts', 'checking');

    const fromAccountSnap = await getDoc(fromAccountRef);
    const toAccountSnap = await getDoc(toAccountRef);

    if (fromAccountSnap.exists() && toAccountSnap.exists()) {
        const fromBalance = fromAccountSnap.data().balance;
        const toBalance = toAccountSnap.data().balance;

        if (fromBalance >= amount) {
            await updateDoc(fromAccountRef, { balance: fromBalance - amount });
            await updateDoc(toAccountRef, { balance: toBalance + amount });
        } else {
            throw new Error('Insufficient funds');
        }
    } else {
        throw new Error('Account not found');
    }
};

// Function to get userID by RUT
export const getUserIDByRUT = async (rut) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('rut', '==', rut));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id; // Retorna el primer usuario encontrado con ese RUT
    } else {
        throw new Error('No user found with this RUT.');
    }
};

// Function to set RUT
export const setRUT = async (userID, rut) => {
    const userRef = doc(db, 'users', userID);
    await updateDoc(userRef, { rut });
};

// Function to deduct balance from checking account
export const deductFromChecking = async (userID, amount) => {
    const accountRef = doc(db, 'users', userID, 'accounts', 'checking');
    const accountSnap = await getDoc(accountRef);
    if (accountSnap.exists()) {
        const currentBalance = accountSnap.data().balance;
        if (currentBalance >= amount) {
            await updateDoc(accountRef, { balance: currentBalance - amount });
        } else {
            throw new Error('Insufficient funds');
        }
    } else {
        throw new Error('Account not found');
    }
};

// Function to add a payment
export const addPayment = async (userID, paymentName, amount) => {
    const paymentsRef = collection(db, 'users', userID, 'payments');
    await addDoc(paymentsRef, { name: paymentName, amount, date: new Date() });
};
