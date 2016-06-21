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
