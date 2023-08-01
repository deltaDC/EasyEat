/*
The catchAsync function is a utility function designed to simplify error handling in asynchronous route 
handlers within an Express application. It takes an asynchronous function (func) as input and returns 
a new function that acts as a middleware.
*/


export default function catchAsync(func) {
    return (req, res, next) => {
        func(req, res, next)
            .catch(next)
    }
}