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
