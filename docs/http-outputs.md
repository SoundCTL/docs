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
