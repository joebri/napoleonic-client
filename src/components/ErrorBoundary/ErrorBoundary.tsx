/** @jsxImportSource @emotion/react */

import { Component, ErrorInfo, ReactNode } from 'react';

import { classes } from './ErrorBoundary.style';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // logErrorToMyService(error, errorInfo);
    console.error(
      `%cError: ${JSON.stringify(error)}, ${JSON.stringify(errorInfo)}`,
      'color:red'
    );
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
