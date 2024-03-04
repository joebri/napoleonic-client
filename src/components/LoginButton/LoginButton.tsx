import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    const handleButtonClick = async () => {
        await loginWithRedirect();
    };

    return (
        <Button onClick={handleButtonClick} variant="contained">
            Log In
        </Button>
    );
};

export { LoginButton };
