const LoadingIndicator = ({heading}) => {
    return (
        <div className="main-content">
            <h2 className="green">{heading}</h2>
            <div className="text-center my-5 main-content">
                <div className="spinner-border text-success" role="status" style={{width: "3rem", height: "3rem"}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export default LoadingIndicator;