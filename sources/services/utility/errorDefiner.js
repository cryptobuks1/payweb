const responseStatusHandler = {
    'SUCCESS': {
        "CODE": 200,
        "TOKEN_SUCCESS": 'Autherization token generated successfully',
        "MPIN_LOGIN_SUCCESS" : 'Login with mpin success',
        "LOGIN_SUCCESS": 'Login success',
        "COUNTRY_INFO": 'Country details success'
    },
    'NO_CONTENT': {
        "CODE": 204,
    },
    'BAD_REQUEST': {
        "CODE": 400,
    },
    'FORBIDDEN': {
        "CODE": 403,
        "TOKEN_EXPIRE": "You are un-autherized , token expired",
        "VALID_HEADER": "Provide valid header"
    },
    'NOT_FOUND': {
        "CODE": 404,
        "INVALID_USER": "User not found",
        "INVALID_DATA": "Invalid user details",
        "INVALID_COUNTRY": "Country not found",
        "TOKEN_FAILURE": "Failure While creating token",
        "FETCH_FAILURE": "Error while fetching details",
        "INVALID_CURRENCY_STATUS": "Currency status not found",
        "INVALID_CURRENCIES": "Currencies not found"
    },
    'INTERNAL_SERVER_ERROR': {
        "CODE": 500,
    },
    "PAYMENTS": {
        "SUCCESS": {
            "CODE": "0001",
            "DESCRIPTION": "Payment successfully done"
        },
        "CARD_FAILURE": {
            "CODE": "0002",
            "DESCRIPTION": "Payment not done , Invalid card details"
        },
        "CHECKSUM_FAILURE": {
            "CODE": "0003",
            "DESCRIPTION": "Payment check sum generation failure"
        },
        "SERVER_FAILURE": {
            "CODE": "0004",
            "DESCRIPTION": "Payment server down"
        }
    }

}

let customLogger = function (status, description) {
    return `status code : ${status} -- description : ${description}`
};

module.exports = { responseStatusHandler, customLogger }

