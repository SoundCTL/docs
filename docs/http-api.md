
</br>
</br>

# HTTP API

## Overview

SoundCTL HTTP API is <a href="https://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">REST</a> friendly. It has predictable resource-oriented URLs.
It supports Authentication through built-in HTTP features and <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">cross-origin resource sharing</a> allowing you to interact securely with our API from any client-side app.
Requests and reponses are all in <a href="http://www.json.org/" target="_blank">JSON</a> format for easy and human-readable data representation.

</br>
</br>

## Authentication

SoundCTL enforces a secure connection (SSL/TLS) on all API calls. Any attempt to make a request over a non encrypted connection will fail.
Any API request without authentication will also fail with HTTP status code 401.

SoundCTL provides two methods of authentication:

- [API Key](#api-key)
- [JSON Web Tokens](#json-web-tokens)

### API Key

Each time you create a new SoundCTL.io instance we will randomly generate for you an API key that you can use to access the API routes.
You can authenticate using your API Key either by HTTP Authorization header (recommended) or by URL query param:

```http
curl -v -H "Authorization: api yQsz3uvr9WdTUIdKTzcXbNo9fJoudvpqw8sT6mqOjkMYmPejg9EjpeV5Lut3UWm" "https://callsign.soundctl.io/inputs"
```

```sh
curl -v "https://callsign.soundctl.io/inputs?key=yQsz3uvr9WdTUIdKTzcXbNo9fJoudvpqw8sT6mqOjkMYmPejg9EjpeV5Lut3UWm"
```

**Security Note 1**
By authenticating using this method (API Key) you'll have both read and write permissions on all the provided API routes.
Be careful and keep you key secured :)

**Security Note 2**
In the unfortunate case your API key is compromised you can generate a new one from your dashboard.

### JSON Web Tokens

<a href="https://jwt.io/" target="_blank">JSON Web Tokens</a> or JWT are an open standard to securely transmit information between clients and the API. They are also a mean to authenticate to the API.

You can generate tokens for any of your clients by using your API Key as the secret.

**Security Note**

Using your API key to sign the tokens means that in case you need to regenerate it, all existing tokens will be permanently invalidated.

We currently support only SHA-256 as the HMAC hashing algorithm.

Example JWT Token:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjAxNzkwOTAsImV4cCI6MTQ5MTcxNTA5MCwicm9sZXMiOlsiY29uc3VtZXIiXX0.df-ZabXBsu9KJVpGYiVudHi56BM0oKyBkJtqTDqzF6o
```

It decodes into:

Header:
```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

Payload:
```json
{
  "iat": 1460179090,
  "exp": 1491715090,
  "roles": ["consumer"]
}
```

Like API keys,  tokens can be used to authenticate a connection either by HTTP Authorization Header (recommended) or URL Query Param:

```sh
curl -v -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjAxNzkwOTAsImV4cCI6MTQ5MTcxNTA5MCwicm9sZXMiOlsiY29uc3VtZXIiXX0.df-ZabXBsu9KJVpGYiVudHi56BM0oKyBkJtqTDqzF6o" https://callsign.soundctl.io/inputs
```

```sh
curl -v https://callsign.soundctl.io/inputs?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjAxNzkwOTAsImV4cCI6MTQ5MTcxNTA5MCwicm9sZXMiOlsiY29uc3VtZXIiXX0.df-ZabXBsu9KJVpGYiVudHi56BM0oKyBkJtqTDqzF6o
```

### Roles

By using JSON Web Tokens it is possible to grant different levels of access to the API.
The following roles are defined:

Role | Description
------------ | -------------
admin | The admin role has read and write permissions on all API routes. It is the same level of access as when using the API Key as authentication method.
producer | The producer role has read permissions on all routes and write permissions on patchable routes (can only use GET and PATCH methods).
consumer | The consumer role has read-only permissions (can only use GET method).

</br>
</br>

## Errors

In case of an error a valid <a href="https://httpstatuses.com/" target="_blank">HTTP Status code</a> will be returned in the response header along with an informative JSON object in the body:

Name | Type | Description
------------ | ------------- | -------------
statusCode | Integer | HTTP Response status code.
error | String | HTTP status message.
message | String | A message providing more details about the error.

Example:

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Wrong API key"
}
```




