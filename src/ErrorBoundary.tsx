/** @jsxImportSource @emotion/react */

import { Component } from 'react';

import { classes } from './ErrorBoundary.style';

class ErrorBoundary extends Component {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // logErrorToMyService(error, errorInfo);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div css={classes.container}>
          <h1>Uniformology</h1>
          <h2>Something went wrong!</h2>
          <p>The error has been reported. Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
export { ErrorBoundary };
