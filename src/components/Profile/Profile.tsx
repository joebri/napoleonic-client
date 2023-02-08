/** @jsxImportSource @emotion/react */

import { useAuth0 } from '@auth0/auth0-react';

import { Loading } from 'components/Loading/Loading';
import { classes } from './Profile.style';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated && (
        <div css={classes.profile}>
          <img src={user?.picture} alt={user?.name} title={user?.name} />
        </div>
      )}
    </>
  );
};

export { Profile };
