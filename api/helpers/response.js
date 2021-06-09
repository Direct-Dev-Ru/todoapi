function getResObject(message, errorCode) {
  return {
    isError: errorCode ? true : false,
    errorCode: errorCode ? errorCode : 0,
    message: message ? message : ""
  };
}

module.exports = { getResObject };
