function fakeRequest(request) {
  const __inner = request ?? {};

  return Object.freeze({
    ...__inner
  });
}

module.exports = { fakeRequest };
