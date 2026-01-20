let currentToken = null;

module.exports = {
  setToken: (token) => {
    currentToken = token;
  },
  getToken: () => {
    return currentToken;
  }
};