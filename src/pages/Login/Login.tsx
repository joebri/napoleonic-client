/** @jsxImportSource @emotion/react */

import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { classes } from './Login.style';

import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from 'components/Loading/Loading';
import { LoginButton } from 'components/LoginButton/LoginButton';
import { useHeaderTitleStateSet } from 'state';

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
    <div css={classes.container}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Typography css={classes.title} variant="h2">
        Napoleonic Uniformology
      </Typography>
      <LoginButton />
    </div>
  );
};

export { Login };
