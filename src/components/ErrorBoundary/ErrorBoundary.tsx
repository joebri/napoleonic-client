import { Component, ErrorInfo, ReactNode } from 'react';

import { LogErrorBaseProps, logError } from 'utilities/logError';

import styles from './ErrorBoundary.module.scss';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

interface LogErrorProps extends LogErrorBaseProps {
    errorInfo: ErrorInfo;
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
        logError<LogErrorProps>({
            moduleName: 'ErrorBoundary',
            name: 'componentDidCatch',
            exception: error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.container}>
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
