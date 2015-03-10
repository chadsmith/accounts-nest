Nest = {};

OAuth.registerService('nest', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };

  return {
    serviceData: serviceData
  };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'nest'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://api.home.nest.com/oauth2/access_token", {
        params: {
          client_id: config.clientId,
          redirect_uri: OAuth._redirectUri('nest', config),
          client_secret: OAuth.openSecret(config.clientSecret),
          code: query.code,
          grant_type: 'authorization_code'
        }
      }).content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Nest. " + err.message),
                   {response: err.response});
  }

  // If 'responseContent' parses as text, it is probably an error
  if (!isJSON(responseContent)) {
    throw new Error("Failed to complete OAuth handshake with Nest. " + responseContent);
  }

  // Success!  Extract the nest access token and expiration
  // time from the response
  var parsedResponse = JSON.parse(responseContent);
  var nestAccessToken = parsedResponse.access_token;
  var nestExpires = parsedResponse.expires_in;

  if (!nestAccessToken) {
    throw new Error("Failed to complete OAuth handshake with nest " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    accessToken: nestAccessToken,
    expiresIn: nestExpires
  };
};

Nest.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};