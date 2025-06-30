const asyncHandler = (fn) => async(req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.log(error);
        res
        .status(statusCode)
        .json({
            message : error.message,
            error : error
        })
    }
}

export {asyncHandler}