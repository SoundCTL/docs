<!-- version -->
# SoundCTL API v1 Documentation
<!-- versionstop -->

<!-- toc -->

- [Introduction](#introduction)
  - [What is SoundCTL?](#what-is-soundctl)
    - [Core concepts](#core-concepts)
    - [Processing](#processing)
  - [Quickstart](#quickstart)
    - [Requirements](#requirements)
    - [Step 1 - Create an Input](#step-1---create-an-input)
    - [Step 2 - Start sending audio data](#step-2---start-sending-audio-data)
    - [Step 3 - Create an Output](#step-3---create-an-output)
    - [Step 4 - Create a Link](#step-4---create-a-link)
    - [Step 5 - Listen](#step-5---listen)
  - [Demos & Prototypes](#demos--prototypes)
    - [Web Audio Input](#web-audio-input)
- [HTTP API](#http-api)
  - [Overview](#overview)
  - [Authentication](#authentication)
    - [API Key](#api-key)
    - [JSON Web Tokens](#json-web-tokens)
    - [Roles](#roles)
  - [Errors](#errors)
  - [/inputs](#inputs)
    - [`POST` /inputs](#post-inputs)
      - [Errors](#errors)
    - [`DELETE` /inputs](#delete-inputs)
      - [Errors](#errors)
    - [`GET` /inputs/:id](#get-inputsid)
      - [Errors](#errors)
    - [`GET` /inputs](#get-inputs)
      - [Errors](#errors)
    - [`GET` /inputs/:id/volume](#get-inputsidvolume)
      - [Errors](#errors)
    - [`PATCH` /inputs/:id/volume](#patch-inputsidvolume)
      - [Errors](#errors)
    - [`GET` /inputs/:id/eq](#get-inputsideq)
      - [Errors](#errors)
    - [`PATCH` /inputs/:id/eq](#patch-inputsideq)
      - [Errors](#errors)
    - [`GET` /inputs/:id/filters](#get-inputsidfilters)
      - [Errors](#errors)
    - [`PATCH` /inputs/:id/filters](#patch-inputsidfilters)
      - [Errors](#errors)
    - [`GET` /inputs/:id/meter](#get-inputsidmeter)
  - [/links](#links)
    - [`POST` /links](#post-links)
      - [Errors](#errors)
    - [`DELETE` /links/:id](#delete-linksid)
      - [Errors](#errors)
    - [`GET` /links/:id](#get-linksid)
      - [Errors](#errors)
    - [`GET` /links](#get-links)
      - [Errors](#errors)
  - [/outputs](#outputs)
    - [`POST` /outputs](#post-outputs)
      - [Errors](#errors)
    - [`DELETE` /outputs](#delete-outputs)
      - [Errors](#errors)
    - [`GET` /outputs/:id](#get-outputsid)
      - [Errors](#errors)
    - [`GET` /outputs](#get-outputs)
      - [Errors](#errors)
    - [`GET` /outputs/:id/volume](#get-outputsidvolume)
      - [Errors](#errors)
    - [`PATCH` /outputs/:id/volume](#patch-outputsidvolume)
      - [Errors](#errors)
    - [`GET` /outputs/:id/eq](#get-outputsideq)
      - [Errors](#errors)
    - [`PATCH` /outputs/:id/eq](#patch-outputsideq)
      - [Errors](#errors)
    - [`GET` /outputs/:id/filters](#get-outputsidfilters)
      - [Errors](#errors)
    - [`PATCH` /outputs/:id/filters](#patch-outputsidfilters)
      - [Errors](#errors)
    - [`GET` /outputs/:id/meter](#get-outputsidmeter)
      - [Errors](#errors)
- [WebSocket API](#websocket-api)
  - [Overview](#overview)
  - [Authentication](#authentication)
    - [API Key](#api-key)
    - [JSON Web Token](#json-web-token)
  - [Messages](#messages)
    - [Message Object](#message-object)
    - [Examples](#examples)
  - [Events](#events)
    - [Examples](#examples)
  - [Errors](#errors)
    - [Error Object](#error-object)
    - [Examples](#examples)
- [Objects Reference](#objects-reference)
  - [*Volume*](#volume)
  - [*Eq*](#eq)
    - [*Eq Band*](#eq-band)
  - [*Filters*](#filters)
    - [*Lowpass*](#lowpass)
    - [*Highpass*](#highpass)
  - [*Meter*](#meter)

<!-- tocstop -->

# Introduction

## What is SoundCTL?

SoundCTL is a simple API for real-time audio processing, mixing and routing.
Our goal is to provide developers with a simple and programmatic interface to our powerful audio engine.

### Core concepts

**Inputs**

Inputs are used to get audio data into your SoundCTL instance.
There are two types of Input:

- **data** :  input consisting of audio data sent by the client to your instance.

Examples:  music file, microphone.

- **url** :  input consisting of the URL of a remote resource to be loaded into your instance.

Examples:  YouTube URL, Soundcloud track URL, Icecast/Shoutcast stream etc.

**Links**

A *Link* is a connection between an input and an output.
It's the way to route audio from an input to an output, just like an aux cable.

**Outputs**

An *Output* is a live stream transmitted by your instance at which your clients can connect and listen to.
An *Output* is an entity that receives data from an *Input* through a *Link*, encodes it and makes it available to all your clients.

### Processing

Both *Inputs* and *Outputs* have several controls and properties that allow you to have the highest degree of control over your sound.

*Controls*:

- Volume
- Equalizer
- Filters (highpass/lowpass)

*Read-Only Properties*:

- Volume level peaks and averages

</br>
</br>

## Quickstart

Here's a quick step by step guide to create your first stream using SoundCTL API.

### Requirements

A SoundCTL instance, a <a href="https://en.wikipedia.org/wiki/Terminal_emulator" target="_blank">terminal</a>, <a href="https://curl.haxx.se/" target="_blank">cURL</a> , <a href="https://www.ffmpeg.org/" target="_blank">FFmpeg</a>, an mp3 music file.

### Step 1 - Create an Input

First of all let's create an input by issuing the following command:

```sh
curl -H 'Authorization: api YOUR_API_KEY' -H 'Content-Type: application/json' -X POST -d '{"type": "data", "format": "mp3"}' "https://YOUR_INSTANCE_ID.soundctl.io/inputs"
```

**Note**: Make sure you replace YOUR_API_KEY and YOUR_INSTANCE_ID with the appropriate values. You can find both in your dashboard.

If everything went smoothly you'll get a nice JSON response similar to this:

```json
{
  "type": "data",
  "id": "REn35K4Ogh04LZ6k",
  "createAt": "2016-05-06T07:41:26.512Z",
  "status": "idle",
  "format": "mp3",
  "streamUrl": "https://YOUR_INSTANCE_ID.soundctl.io/rx/REn35K4Ogh04LZ6k.mp3"
}
```

### Step 2 - Start sending audio data

Now we are going to use a very useful tool called FFmpeg to stream a mp3 encoded audio file to our instance.

To do so we need to use the *streamUrl* from the previous response and start sending data to it:

```sh
ffmpeg -re -i track.mp3 -c:a copy -f mp3 "https://YOUR_INSTANCE_ID.soundctl.io/rx/REn35K4Ogh04LZ6k.mp3?key=YOUR_API_KEY"
```

### Step 3 - Create an Output

```sh
curl -H 'Authorization: api YOUR_API_KEY' -H 'Content-Type: application/json' -X POST -d '{"type": "transmission", "format": "mp3"}' "https://YOUR_INSTANCE_ID.soundctl.io/outputs"
```

Again if everything went right you'll get a JSON response containing the output's info:

```json
{
  "type": "transmission",
  "id": "GN0aqrW7mUBdZbzY",
  "createAt": "2016-05-06T07:55:24.750Z",
  "status": "active",
  "format": "mp3",
  "bitRate": 128,
  "sampleRate": 48000,
  "channels": 2,
  "streamUrl": "https://YOUR_INSTANCE_ID.soundctl.io/tx/GN0aqrW7mUBdZbzY.mp3"
}
```

### Step 4 - Create a Link

Here we are going to connect the *Input* and the *Output* we just created.

To do so we create a *Link*:

```sh
curl -H 'Authorization: api YOUR_API_KEY' -H 'Content-Type: application/json' -X POST -d '{"src": "REn35K4Ogh04LZ6k", "dst": "GN0aqrW7mUBdZbzY"}' "https://YOUR_INSTANCE_ID.soundctl.io/links"
```

### Step 5 - Listen

Now it's time to verify that everything worked correctly by listening to the transmission:

```sh
ffplay "https://YOUR_INSTANCE_ID.soundctl.io/tx/GN0aqrW7mUBdZbzY.mp3"
```

**Note**: You can use any player of your choice to play the output transmission.

</br>
</br>

## Demos & Prototypes

Here's a collection of simple demonstrations and prototypes built using SoundCTL's Audio API.

### Web Audio Input

<a href="https://demo.soundctl.io/web_audio_input/" target="_blank">This</a> demo lets you create a transmission directly from your browser.

It works by capturing your microphone's input through the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">WebAudio API</a>. It then automatically encodes and sends it to your SoundCTL instance, ready to mixed and broadcasted.

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




</br>
</br>

## /inputs

### `POST` /inputs

Creates an *Input*.

**Request**

```http
POST /inputs HTTP/1.1
Content-Type: application/json
Accept: application/json
```

JSON properties required to create an *Input* :

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
type | enum | data </br> url | The type of the input to be created.

**data** *Input*

JSON properties required to create an *Input* of type **data** :

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
format | enum | opus </br> flac </br> aac </br> mp3 | The format of the audio stream to be sent.

**Example**

```json
{
  "type": "data",
  "format": "mp3"
}
```

**url** *Input*

JSON properties required to create an *Input* of type **url** :

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
url | String | 1 <= N <= 255 characters | URL of the remote resource to be used as input.

**Example**

```json
{
  "type": "url",
  "url": "https://www.youtube.com/watch?v=ZkAT5krv_6c"
}
```

**Response**

```http
HTTP 1.1 201 Created
Content-Type: application/json
Location: /inputs/:id
```

**Payload Properties**

JSON properties in the response body:

Name | Type | Description
------------ | ------------- | -------------
id | String | The unique identifier of the resource.
type | String | The input type.
createAt | String | Time at which the input was created. (<a href="https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations" target="_blank">ISO 8601</a>).
status | enum | The input status.

**data** *Input*

Additional JSON properties in the response body if the *Input*  type is **data** :

Name | Type | Description
------------ | ------------- | -------------
format | String | The format of the audio stream to be sent.
streamUrl | String | The URL to be used for sending the audio data.

**Example**

```json
{
  "id": "Lq1K8EZWwUYZ3kO5",
  "type": "data",
  "format": "mp3",
  "streamUrl": "https://callsign.soundctl.io/rx/Lq1K8EZWwUYZ3kO5.mp3",
  "createdAt": "2016-03-04T20:50:47.242Z",
  "status": "idle"
}
```

To start feeding live audio data to an *Input* of type **data** you need to make an HTTP POST request and send the data using <a href="https://en.wikipedia.org/wiki/Chunked_transfer_encoding" target="_blank"> chunked encoding </a>:

```http
POST /rx/Lq1K8EZWwUYZ3kO5.mp3 HTTP/1.1
Transfer-Encoding: chunked
Host: callsign.soundctl.io
```

**Example**

```sh
ffmpeg -re -i example_track.mp3 -acodec copy -f mp3 "https://callsign.soundctl.io/rx/Lq1K8EZWwUYZ3kO5.mp3?key=yQsz3uvr9WdTUIdKTzcXbNo9fJoudvpqw8sT6mqOjkMYmPejg9EjpeV5Lut3UWm"
```

**url** *Input*

Additional JSON properties in the response body if the *Input* type is **url** :

Name | Type | Description
------------ | ------------- | -------------
sourceUrl | String | URL of the remote resource used as input.

**Example**

```json
{
  "id": "B0Lq8XrO6uYJbWK2",
  "type": "url",
  "sourceUrl": "https://www.youtube.com/watch?v=ZkAT5krv_6c",
  "createdAt": "2016-03-04T20:50:47.242Z",
  "status": "idle"
}
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

</br>

### `DELETE` /inputs

**Request**

```http
DELETE /inputs/:id HTTP/1.1
Accept: application/json
```

**Response**

```json
{
  "success": true
}
```

#### Errors

`401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v -X DELETE "https://callsign.soundctl.io/inputs/B0Lq8XrO6uYJbWK2"
```

</br>

### `GET` /inputs/:id

**Request**

```http
GET /inputs/:id HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v "https://callsign.soundctl.io/inputs/Lq1K8EZWwUYZ3kO5"
```

**Response**

```json
{
  "id": "Lq1K8EZWwUYZ3kO5",
  "type": "data",
  "format": "mp3",
  "streamUrl": "https://callsign.soundctl.io/rx/Lq1K8EZWwUYZ3kO5.mp3",
  "createdAt": "2016-03-04T20:50:47.242Z",
  "status": "active"
}
```

</br>

### `GET` /inputs

**Request**

```http
GET /inputs HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

**Properties**

Type | Description
----- | -----
Array of Input Objects | An array of all the existing inputs.

#### Errors

`401 Unauthorized`, `500 Internal Server Error`

**Example**

```sh
curl -v "https://callsign.soundctl.io/inputs"
```

**Response**

```json
[{
  "id": "Lq1K8EZWwUYZ3kO5",
  "type": "data",
  "format": "mp3",
  "streamUrl": "https://callsign.soundctl.io/rx/Lq1K8EZWwUYZ3kO5.mp3",
  "createdAt": "2016-03-04T20:50:47.242Z",
  "status": "active"
}, {
  "id": "B0Lq8XrO6uYJbWK2",
  "type": "url",
  "sourceUrl": "https://www.youtube.com/watch?v=ZkAT5krv_6c",
  "createdAt": "2016-03-04T20:50:47.242Z",
  "status": "active"
}]
```

</br>

### `GET` /inputs/:id/volume

Retrieves the *Volume* of the specified *Input*.

**Request**

```http
GET /inputs/:id/volume HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In  case of success the response body will be an array of <a href="#objects-volume">*Volume*</a> objects.
The length of the array will be equal to the number of audio channels of the *Input*.

```json
[
  {"level": 6.00},
  {"level": -5.00}
]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /inputs/:id/volume

Updates the <a href="#objects-volume">*Volume*</a> of the specified input.

**Request**

```http
PATCH /inputs/:id/volume HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```

Request body needs to be a valid <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a> as defined  by <a href="http://tools.ietf.org/html/rfc6902" target="_blank">RFC 6902</a>.

**Example**

```json
[{
  "op": "replace",
  "path": "/0/level",
  "value": 4.00
}, {
  "op": "replace",
  "path": "/1/level",
  "value": -4.00
}]
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

```json
[{
  "op": "replace",
  "path": "/0/level",
  "value": 4.00
}, {
  "op": "replace",
  "path": "/1/level",
  "value": -4.00
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `GET` /inputs/:id/eq

Retrieves the <a href="#objects-eq">*Eq*</a> of the specified *Input*.

**Request**

```http
GET /inputs/:id/eq HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of <a href="#objects-eq">*Eq*</a> objects.
The length of the array will be equal to the number of audio channels of the *Input*.

```json
[{
  "bands": [{
    "gain": 2,
    "bw": 1.5,
    "freq": 60
  }, {
    "gain": 2,
    "bw": 1.5,
    "freq": 120
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }]
}, {
  "bands": [{
    "gain": 2,
    "bw": 1.5,
    "freq": 60
  }, {
    "gain": 2,
    "bw": 1.5,
    "freq": 120
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }]
}]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /inputs/:id/eq

Updates the <a href="#objects-eq">*Eq*</a> of the specified *Input*.

**Request**

```http
PATCH /inputs/:id/eq HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```

Request body needs to be a valid <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a> as defined  by <a href="http://tools.ietf.org/html/rfc6902" target="_blank">RFC 6902</a>.

```json
[{
  "op": "replace",
  "path": "/0/bands/0",
  "value": {
    "gain": 1.00,
    "bw": 2.00,
    "freq": 45.00
  }
}]
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

```json
[{
  "op": "replace",
  "path": "/0/bands/0",
  "value": {
    "gain": 1.00,
    "bw": 2.00,
    "freq": 45.00
  }
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `GET` /inputs/:id/filters

Retrieves the <a href="#objects-filters">*Filters*</a> of the specified *Input*.

**Request**

```http
GET /inputs/:id/filters HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

In case of success the response body will be an array of <a href="#objects-filters">*Filters*</a> objects.
The length of the array will be equal to the number of audio channels of the *Input*.

```json
[{
  "lowpass": {
    "bw": 0.66,
    "freq": 20000.0
  },
  "highpass": {
    "bw": 0.66,
    "freq": 20.0
  }
}, {
  "lowpass": {
    "bw": 0.66,
    "freq": 20000.0
  },
  "highpass": {
    "bw": 0.66,
    "freq": 20.0
  }
}]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /inputs/:id/filters


Updates the <a href="#objects-filters">*Filters*</a> of the specified *Input*.

**Request**

```http
PATCH /inputs/:id/filters HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```

Request body needs to be a valid <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a> as defined  by <a href="http://tools.ietf.org/html/rfc6902" target="_blank">RFC 6902</a>.

```json
[{
  "op": "replace",
  "path": "/0/highpass/freq",
  "value": 450
}, {
  "op": "replace",
  "path": "/1/highpass/freq",
  "value": 450
}]
```

**Response**

```http
HTTP 1.1 200 OK
```

```json
[{
  "op": "replace",
  "path": "/0/highpass/freq",
  "value": 450
}, {
  "op": "replace",
  "path": "/1/highpass/freq",
  "value": 450
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

 ### `GET` /inputs/:id/meter

**Request**

```http
GET /inputs/:id/meter HTTP/1.1
Accept: application/json
```

```
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of *Meter* objects.
The length of the array will be equal to the number of audio channels of the *Input*.

**Example**

```json
[{
  "peak": 73.0,
  "avg": 16.0
}, {
  "peak": 65.0,
  "avg": 14.0
}]
```

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`
</br>
</br>

## /links

### `POST` /links

Creates a *Link*.

**Request**

```http
POST /links HTTP/1.1
Content-Type: application/json
Accept: application/json
```

**Properties**

JSON properties required to create an *Link* :

Name | Type | Description
------------ | ------------- | -------------
src | String | The id of the source resource.
dst | String | The id of the destination resource.

**Example**

```json
{
  "src": "Lq1K8EZWwUYZ3kO5",
  "dst": "NzZsGQDWxKh2X8Hc"
}
```

**Response**

```http
HTTP 1.1 201 Created
Content-Type: application/json
Location: /links/:id
```

**Payload Properties**

JSON properties in the response body:

Name | Type | Description
------------ | ------------- | -------------
id | String | The id of the resource.
src | String | The id of the source resource.
dst | String | The id of the destination resource.
createdAt | String | Time at which the link was created. (<a href="https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations" target="_blank">ISO 8601</a>).

**Example**

```json
{
  "id": "23thKlDCqF0rJPZy",
  "src": "Lq1K8EZWwUYZ3kO5",
  "dst": "NzZsGQDWxKh2X8Hc",
  "createAt": "2016-03-04T20:50:47.242Z"
}
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

</br>

### `DELETE` /links/:id

Destroys a *Link*

**Request**

```http
DELETE /links/:id HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true
}
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`,  `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v -X DELETE "https://callsign.soundctl.io/links/23thKlDCqF0rJPZy"
```

</br>

### `GET` /links/:id

**Request**

```http
GET /links/:id HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

#### Errors

`401 Unauthorized`,  `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v "https://callsign.soundctl.io/links/23thKlDCqF0rJPZy"
```

```json
{
  "id": "23thKlDCqF0rJPZy",
  "src": "Lq1K8EZWwUYZ3kO5",
  "dst": "NzZsGQDWxKh2X8Hc",
  "createAt": "2016-03-04T20:50:47.242Z"
}
```

</br>

### `GET` /links

**Request**

```http
GET /links HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

#### Errors

`401 Unauthorized`,  `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v "https://callsign.soundctl.io/links"
```

```json
[{
  "id": "23thKlDCqF0rJPZy",
  "src": "Lq1K8EZWwUYZ3kO5",
  "dst": "NzZsGQDWxKh2X8Hc",
  "createAt": "2016-03-04T20:50:47.242Z"
}]
```



</br>
</br>

## /outputs

### `POST` /outputs

Creates an *Output*.

**Request**

```http
POST /outputs HTTP/1.1
Content-Type: application/json
Accept: application/json
```

JSON properties required to create an *Output* :

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
type | enum | data </br> url | The type of the output to be created.
format | enum | opus </br> flac </br> aac </br> mp3 | Audio stream format.
bitRate | Number | Look at <a href="https://docs.soundctl.io/docs/outputs#supported-formats">Supported formats</a> | Audio stream bit rate in kbit/s.
sampleRate | Number | Look at <a href="https://docs.soundctl.io/docs/outputs#supported-formats">Supported formats</a> | Audio stream sampling rate in hertz.

**Example**

```json
{
  "type": "transmission",
  "format": "opus",
  "bitRate": 64,
  "sampleRate": 48000
}
```

**Response**

```json
HTTP 1.1 201 Created
Content-Type: application/json
Location: /outputs/:id
```

**Payload Properties**

JSON properties in the response body:

Name | Type | Description
------------ | ------------- | -------------
id | String | The unique identifier of the resource.
type | String | The output type.
createAt | String | Time at which the output was created. (<a href="https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations" target="_blank">ISO 8601</a>).
streamUrl | String | The URL at which clients can connect to and play the stream.
format | enum | Audio stream format.
bitRate | Number | Audio stream bit rate in kbit/s.
sampleRate | Number | Audio stream sampling rate in hertz.
channels | Number | Number of audio channels.

**Example**

```json
{
  "id": "NzZsGQDWxKh2X8Hc",
  "type": "transmission",
  "format": "mp3",
  "streamUrl": "http://callsign.soundctl.io/tx/NzZsGQDWxKh2X8Hc.mp3",
  "bitRate": 64000,
  "sampleRate": 48000,
  "channels": 2,
  "createdAt": "2016-03-04T20:50:47.242Z"
}
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

</br>

### `DELETE` /outputs

**Request**

```http
DELETE /outputs/:id HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true
}
```

#### Errors

`401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v -X DELETE https://callsign.soundctl.io/outputs/NzZsGQDWxKh2X8Hc
```

</br>

### `GET` /outputs/:id

**Request**

```http
GET /outputs/:id HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

#### Errors

`401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

**Example**

```sh
curl -v https://callsign.soundctl.io/outputs/NzZsGQDWxKh2X8Hc
```

```json
{
  "id": "NzZsGQDWxKh2X8Hc",
  "type": "transmission",
  "format": "mp3",
  "streamUrl": "http://callsign.soundctl.io/tx/NzZsGQDWxKh2X8Hc.mp3",
  "bitRate": 64000,
  "sampleRate": 48000,
  "channels": 2,
  "createdAt": "2016-03-04T20:50:47.242Z"
}
```


</br>

### `GET` /outputs

**Request**

```http
GET /outputs HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

**Properties**

Type | Description
------------- | -------------
Array of output Objects | An array of all the existing outputs.

#### Errors

`401 Unauthorized`, `403 Forbidden`, `404 Not Found`

**Example**

```sh
curl -v https://callsign.soundctl.io/outputs
```

```json
[{
  "id": "NzZsGQDWxKh2X8Hc",
  "type": "transmission",
  "format": "mp3",
  "streamUrl": "http://callsign.soundctl.io/tx/NzZsGQDWxKh2X8Hc.mp3",
  "bitRate": 64000,
  "sampleRate": 48000,
  "channels": 2,
  "createdAt": "2016-03-04T20:50:47.242Z"
}]
```

</br>

### `GET` /outputs/:id/volume

Retrieves the *Volume* of the specified *Output*.

**Request**

```http
GET /outputs/:id/volume HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of *Volume* objects.
The length of the array will be equal to the number of audio channels of the *Output*.

**Example**

```json
[
  {"level": 6.00},
  {"level": -5.00}
]
```

#### Errors

`401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /outputs/:id/volume

Updates the *Volume* of the specified *Output*.

**Request**

```http
PATCH /outputs/:id/volume HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```
Request body needs to be a valid <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a> as defined  by <a href="http://tools.ietf.org/html/rfc6902" target="_blank">RFC 6902</a>.

```json
[{
  "op": "replace",
  "path": "/0/level",
  "value": 4.00
}, {
  "op": "replace",
  "path": "/1/level",
  "value": -4.00
}]
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

```json
[{
  "op": "replace",
  "path": "/0/level",
  "value": 4.00
}, {
  "op": "replace",
  "path": "/1/level",
  "value": -4.00
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `GET` /outputs/:id/eq

Retrieves the *Eq* of the specified *Output*.

**Request**

```http
GET /outputs/:id/eq HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of *Eq* objects.
The length of the array will be equal to the number of audio channels of the *Output*.

```json
[{
  "bands": [{
    "gain": 2,
    "bw": 1.5,
    "freq": 60
  }, {
    "gain": 2,
    "bw": 1.5,
    "freq": 120
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }]
}, {
  "bands": [{
    "gain": 2,
    "bw": 1.5,
    "freq": 60
  }, {
    "gain": 2,
    "bw": 1.5,
    "freq": 120
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }]
}]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /outputs/:id/eq

Updates the *Eq* of the specified *Output*.

**Request**

```http
PATCH /outputs/:id/eq HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```

Request body needs to be a valid <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a> as defined  by <a href="http://tools.ietf.org/html/rfc6902" target="_blank">RFC 6902</a>.

```json
[{
  "op": "replace",
  "path": "/0/bands/0",
  "value": {
    "gain": 1.00,
    "bw": 2.00,
    "freq": 45.00
  }
}]
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

```json
[{
  "op": "replace",
  "path": "/0/bands/0",
  "value": {
    "gain": 1.00,
    "bw": 2.00,
    "freq": 45.00
  }
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `GET` /outputs/:id/filters

Retrieves the *Filters* of the specified *Output*.

**Request**

```http
GET /outputs/:id/filters HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of *Filters* objects.
The length of the array will be equal to the number of audio channels of the *Output*.

**Example**

```json
[{
  "lowpass": {
    "bw": 0.66,
    "freq": 20000.0
  },
  "highpass": {
    "bw": 0.66,
    "freq": 20.0
  }
}, {
  "lowpass": {
    "bw": 0.66,
    "freq": 20000.0
  },
  "highpass": {
    "bw": 0.66,
    "freq": 20.0
  }
}]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

</br>

### `PATCH` /outputs/:id/filters

Updates the *Filters* of the specified *Output*.

**Request**

```http
PATCH /outputs/:id/eq HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
```

In case of success the response body will be an array of <a href="#objects-filters">*Filters*</a> objects.
The length of the array will be equal to the number of audio channels of the *Output*.

```json
[{
  "op": "replace",
  "path": "/0/highpass/freq",
  "value": 450
}, {
  "op": "replace",
  "path": "/1/highpass/freq",
  "value": 450
}]
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json-patch+json
```

```json
[{
  "op": "replace",
  "path": "/0/highpass/freq",
  "value": 450
}, {
  "op": "replace",
  "path": "/1/highpass/freq",
  "value": 450
}]
```

#### Errors

`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

</br>

### `GET` /outputs/:id/meter

Retrieves the *Meter* of the specified *Output*.

**Request**

```http
GET /outputs/:id/meter HTTP/1.1
Accept: application/json
```

**Response**

```http
HTTP 1.1 200 OK
Content-Type: application/json
```

In case of success the response body will be an array of *Meter* objects.
The length of the array will be equal to the number of audio channels of the *Output*.

```json
[{
  "peak": 73.0,
  "avg": 16.0
}, {
  "peak": 65.0,
  "avg": 14.0
}]
```

#### Errors

`401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`

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
</br>
</br>

# Objects Reference

## *Volume*

**Properties**

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
level | Number | -120.00 <= N <= 120.00 | Volume level in decibels.

**Example**

```json
{
  "level": -4.50
}
```

## *Eq*

**Properties**

Name | Type | Description
------------ | ------------- | -------------
bands | Array(16) | Array of <a href="#objects-eq-band">*Eq Band*</a> Objects

**Example**

```json
{
  "bands": [{
    "gain": 2.00,
    "bw": 1.50,
    "freq": 60.00
  }, {
    "gain": 2.00,
    "bw": 1.50,
    "freq": 120.00
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }, {
    "gain": 0,
    "bw": 1,
    "freq": 0
  }]
}
```

### *Eq Band*

**Properties**

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
gain | Number | -50.0 <= N <= 20.0 | Amplitude response (gain) in decibels.
bw | Number | 0.5 <= N <= 4.0 | Bandwidth (passband) in octaves.
freq | Number | 20.0 <= N <= 20000.0 | Center frequency in hertz.

**Example**

```json
{
  "gain": 2.00,
  "bw": 1.50,
  "freq": 45.00
}
```

**Info**

```
An Eq Band object with freq set to 0 is considered inactive.
```


## *Filters*

**Properties**

Name | Type | Description
------------ | ------------- | -------------
lowpass | Object | <a href="#objects-lowpass-filter">*Lowpass Filter*</a> Object
highpass | Object | <a href="#objects-lowpass-filter">*Highpass Filter*</a> Object

**Example**

```json
{
  "lowpass": {
    "bw": 1.00,
    "freq": 16000.0
  },
  "highpass": {
    "bw": 1.00,
    "freq": 45.0
  }
}
```

### *Lowpass*

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
bw | Number | -50.0 <= N <= 20.0 | Bandwidth in octaves.
freq | Number | 20.0 <= N <= 20000.0 | Cutoff frequency in hertz.

**Example**

```json
{
  "bw": 1.00,
  "freq": 16000.0
}
```

### *Highpass*

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
bw | Number | -50.0 <= N <= 20.0 | Bandwidth in octaves.
freq | Number | 20.0 <= N <= 20000.0 | Cutoff frequency in hertz.

**Example**

```json
{
  "bw": 1.00,
  "freq": 45.0
}
```

## *Meter*

**Properties**

Name | Type | Valid values | Description
------------ | ------------- | ------------- | -------------
peak | Number | -120.00 <= N <= 120.00 | Volume level peak in decibels.
avg | Number | -120.00 <= N <= 120.00 | Volume level average in decibels.

**Example**

```json
[{
  "peak": 73.0,
  "avg": 16.0
}, {
  "peak": 65.0,
  "avg": 14.0
}]
```
