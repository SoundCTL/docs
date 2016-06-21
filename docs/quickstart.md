
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
