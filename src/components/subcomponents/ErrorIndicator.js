const ErrorIndicator = ({error}) => {
return (
    <div className="main-content">
        <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
        </div>
    </div>
)};

export default ErrorIndicator;