const NoPage = () => {
    return (
        <div className="main-content d-flex flex-column justify-content-center align-items-center text-center" style={{minHeight: 'calc(100vh - 200px)'}}>
        <div>
            <h1 className="green display-1 fw-bold mb-4">404</h1>
            <h2 className="green mb-4">Page Not Found</h2>
            <p className="lead mb-4">Sorry, the page you are looking for does not exist.</p>
            <p>You can go back to the <a href="/" className="text-decoration-none green fw-bold">homepage</a>.</p>
        </div>
</div>
);
}

export default NoPage;