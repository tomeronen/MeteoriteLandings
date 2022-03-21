import React from "react";

interface iErrorBoundaryProps {
    errorMsg?: React.ReactNode;
}

class ErrorBoundary extends React.Component<Readonly<iErrorBoundaryProps>, {hasError: boolean}>{

    static defaultProps: iErrorBoundaryProps = {
        errorMsg: <h1> Something went wrong. :( </h1>
    }

    constructor(props: iErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.errorMsg;
        }
        return this.props.children;
    }
}




export default ErrorBoundary;