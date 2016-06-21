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



