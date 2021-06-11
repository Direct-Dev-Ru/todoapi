function getResObject(message, errorCode) {
  return {
    isError: errorCode ? true : false,
    errorCode: errorCode ? errorCode : 0,
    message: message ? message : ""
  };
}

function fakeResponse() {
  const __inner = {};

  function status(code) {
    __inner.code = code;
    return this;
  }
  function send(object) {
    __inner.send = object;
    console.log("fake response send object:", object);
  }
  function json(object) {
    __inner.send = object;
    console.log(
      "fake response json object send:",
      JSON.stringify(object, null, "\t")
    );
  }

  return Object.freeze({
    data: __inner,
    send,
    json,
    status
  });
}

module.exports = { getResObject, fakeResponse };
