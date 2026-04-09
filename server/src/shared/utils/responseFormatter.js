class ResponseFormatter {
    static success(data = null,message = 'Success',statusCode = 200) {
        return {
            success: true,
            message,
            data,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }

    static error(message = 'Error', statusCode = 500, errors = null) {
        return {
            success: false,
            message,
            errors,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }

    static validationError(errors, message = 'Validation Error', statusCode = 400) {
        return {
            success: false,
            message,
            errors,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }

    static pagination(data = null, page, limit, totalItems, message = 'Success', statusCode = 200) {
        const totalPages = Math.ceil(totalItems / limit);
        return {
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
            },
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
}


export default ResponseFormatter;