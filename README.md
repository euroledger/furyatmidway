# Fury at Midway, (c) Bonsai Games

This is a PC version of the board game _Fury at Midway_ by Yasushi Nakaguro with AI to allow solitaire play.
The intention is to have an AI control either the Japanese or US fleets (or both).

As of Dec 25 the US AI is implemented; the IJN AI is still under development.

# Installation (Windows)

## Pre-Requisite: NodeJs

You must have nodejs (javascript) installed. To install on Windows, go to the download page for nodejs and
follow the instructions:

https://nodejs.org/en/download

NodeJS comes with a tool called npm, and it is this we use to install the game.

## Installation Instructions (Windows)

1. Open a Windows command shell (Start bar, run the "cmd" shell)

2. If you have git installed, clone the source code from the repository:

`git clone https://github.com/euroledger/furyatmidway.git`

3. Otherwise download the zip file:

Go to the github repository

`https://github.com/euroledger/furyatmidway`

Then select `Code` and `Download ZIP` as shown here

![image info](/public/images/download.jpg)

Unpack the zip folder into a new source code folder called furyatmidway then:

4. cd to the source code folder:

`cd furyatmidway`

5. Install the game:

`npm install`

6. Run the game with the command:

`npm start`

In a web browser, go to the following URL to see the game:

`localhost:3000`

(It is recommended to play the game in Full Screen mode which is F11 to enter/exit on Windows/ Adjust the zoom setting to maximise the window if required)

I tried the above installation on Linux/Mac and it is the same, and works fine.

As of Dec 2025, I have tested the game on all browsers; on PC/Linux/Mac. It runs on all browsers and plaforms.

__Exception: The game does NOT work on Firefox (drag and drop bug in that browser).__



