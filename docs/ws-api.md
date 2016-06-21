
</br>
</br>

# WebSocket API

## Overview

SoundCTL <a href="https://tools.ietf.org/html/rfc6455" target="_blank">WebSocket</a> API allows you to send <a href="#ws-messaging">Messages</a> and receive <a href="#ws-events">Events</a> in real-time, granting you the highest degree of control over your instance.

With the exception of <a href="#ws-events">Events</a> the two APIs (HTTP and WebSocket) are interchangeable.

SoundCTL WebSocket API has the huge advantage of having a persistent bidirectional connection between server and clients, thus being able to send and receive a vast amount of updates in a small period of time while also keeping all the connected clients synchronized through <a href="#ws-events">Events</a>.

</br>
</br>

## Authentication

As for the <a href="#http-api">HTTP API</a>, authentication is done either by using an API key or a JSON Web Token.
For security reasons all WebSocket connections must be initiated using the secure <code>wss://</code> protocol.
Please refer to the <a href="#http-auth">HTTP Authentication</a> section for more info.

### API Key

```js
var exampleSocket = new WebSocket("wss://callsign.soundctl.io/?key=yQsz3uvr9WdTUIdKTzcXbNo9fJoudvpqw8sT6mqOjkMYmPejg9EjpeV5Lut3UWm");
```

### JSON Web Token

```js
var exampleSocket = new WebSocket("wss://callsign.soundctl.io/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NjAxNzkwOTAsImV4cCI6MTQ5MTcxNTA5MCwicm9sZXMiOlsiY29uc3VtZXIiXX0.df-ZabXBsu9KJVpGYiVudHi56BM0oKyBkJtqTDqzF6o");
```

</br>
</br>

## Messages

A Message is a JSON Object consisting of:
 -  a **method** identifying the action to be taken
 -  a **path** identifying the target resource
 -  a **data** object containing the payload of the request in case of success
 -  a list of **errors** in case of failure

### Message Object

Name | Type | Required | Description
------------ | ------------- | ------------- | -------------
method | String | true | Equivalent to the <a href="#http-api">HTTP API</a> request header method.
path | String | true | Equivalent to the <a href="#http-api">HTTP API</a> request header URL.
payload | Object or Array of Objects | false | Equivalent to the <a href="#http-api">HTTP API</a> request body. Not present in case of error.
error | Object | false | An Error Object. Present only in case of error.

### Examples

Creates a new *Input* of type **data**.

```json
{
  "method": "post",
  "path": "/inputs",
  "payload": {
    "type": "data",
    "format": "mp3"
  }
}
```

Retrieves the *Input*.

```json
{
  "method": "get",
  "path": "/inputs/Lq1K8EZWwUYZ3kO5"
}
```

Updates *Volume* levels of an *Output*.

```json
{
  "method": "patch",
  "path": "/outputs/6502a3d",
  "data": [{
    "op": "replace",
    "path": "/0/level",
    "value": 4.00
  }, {
    "op": "replace",
    "path": "/1/level",
    "value": -4.00
  }]
}
```

Error destroying an *Output*.

```json
{
  "method": "delete",
  "path": "/outputs/38cb6e3",
  "errors": [{
    "code": 404,
    "info": "resource not found"
  }]
}
```

</br>
</br>

## Events

Events are one of the main features of the WebSocket API. Their main purpose is to update a client whenever a resource is created, updated or destroyed.
Events triggered by the change of a resource are broadcasted to all the connected clients hence keeping them synchronized.

### Examples

An *Input* has been created:

```json
{
  "method": "post",
  "path": "/inputs",
  "payload": {
    "id": "Lq1K8EZWwUYZ3kO5",
    "type": "data",
    "format": "mp3",
    "streamUrl": "https://callsign.soundctl.io/LskcHe.mp3",
    "createdAt": "2016-03-04T20:50:47.242Z",
    "status": "idle"
  }
}
```

The *Volume* of an *Input* has been updated:

```json
{
  "method": "post",
  "path": "/inputs/Lq1K8EZWwUYZ3kO5/volume",
  "payload": [{
    "op": "replace",
    "path": "/0/level",
    "value": 4
  }, {
    "op": "replace",
    "path": "/1/level",
    "value": -4
  }]
}
```

An *Input* has been destroyed:

```json
{
  "method": "delete",
  "path": "/inputs/Lq1K8EZWwUYZ3kO5"
}
```

*Input* *Meter* update:

```json
{
  "method": "post",
  "path": "/inputs/Lq1K8EZWwUYZ3kO5/meter",
  "payload": [{
    "op": "replace",
    "path": "/0/peak",
    "value": 22.33
  }, {
    "op": "replace",
    "path": "/1/peak",
    "value": 16.11
  }]
}
```

</br>
</br>

## Errors

In case of an error a *Message* will be sent to the client with an *errors* field containing a list of *Error Objects*.

### Error Object

Name | Type | Description
------------ | ------------- | -------------
code | Integer | Equivalent to the HTTP response status code.
info | String | A human-readable message providing more details about the error.

### Examples

```json
{
  "method": "delete",
  "path": "/outputs/38cb6e3",
  "errors": [{
    "code": 404,
    "info": "resource not found"
  }]
}
```

```json
{
  "method": "post",
  "path": "/inputs",
  "errors": [{
    "code": 400,
    "info": "the specified audio format is not supported"
  }]
}
```
