<!-- version --><!-- versionstop -->

<!-- toc --><!-- tocstop -->

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
