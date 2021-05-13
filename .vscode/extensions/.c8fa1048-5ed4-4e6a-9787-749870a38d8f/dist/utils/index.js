"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuthContentFromData = getAuthContentFromData;
exports.validCache = validCache;
exports.isLogged = isLogged;
function getAuthContentFromData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var tokenType = data.token_type,
      accessToken = data.access_token,
      refreshToken = data.refresh_token;

  var authContent = { tokenType: tokenType, accessToken: accessToken, refreshToken: refreshToken };
  if (!authContent.refreshToken) {
    delete authContent.refreshToken;
  }
  return authContent;
}
function validCache(data) {
  return data && !!data.tokenType && !!data.accessToken && !!data.refreshToken;
}

function isLogged(data) {
  return validCache(data);
}