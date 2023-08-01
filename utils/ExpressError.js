class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); // Calls the constructor of the parent class (Error)
        this.message = message; // Sets the error message property
        this.statusCode = statusCode; // Sets the HTTP status code property
    }
}

export default ExpressError