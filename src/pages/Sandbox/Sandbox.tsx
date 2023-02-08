/** @jsxImportSource @emotion/react */

import { ApolloSandbox } from '@apollo/sandbox/react';
import { classes } from 'pages/Sandbox/Sandbox.style';

function Sandbox() {
  return (
    <ApolloSandbox
      css={classes.container}
      initialEndpoint={process.env.REACT_APP_GRAPH_URL}
      includeCookies={false}
    />
  );
}

export { Sandbox };
