

import { accountExists } from './firestoreUtils';

export const handleOpenAccount = async (userID, accountType, setError) => {
    const exists = await accountExists(userID, accountType);
    if (exists) {
        setError(`You already have a ${accountType} account.`);
    } else {
        setError('');
        window.location.href = `/dashboard/open-${accountType}-account`;
    }
};
