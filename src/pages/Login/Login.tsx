import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Loading } from 'components/Loading/Loading';
import { LoginButton } from 'components/LoginButton/LoginButton';

import { useHeaderTitleStateSet } from 'state';

import styles from './Login.module.scss';

const Login = () => {
  const setHeaderTitle = useHeaderTitleStateSet();
  const { isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    setHeaderTitle('Login');
    if (isAuthenticated) {
      logout();
    }
  }, [logout, isAuthenticated, setHeaderTitle]);

  if (isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Typography className={styles.title} variant="h2">
        Napoleonic Uniformology
      </Typography>
      <LoginButton />
    </div>
  );
};

export { Login };
