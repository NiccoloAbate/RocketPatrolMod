# RocketPatrolMod

## Points Breakdown

### Simultaneous 2 player mode - 30

### Mode Selection and differences between single player and 2 player * - 5
You can select how many players you want in the menu and it will affect the play scene. There are some differences between 1 player and 2 player such as rocket color and number of score counters. Additionally, the timer can only go back up in 1 player mode.

### Add time to the clock on hits (Single Player Only) - 20

### Paralax Scrolling - 10

### SFX Randomness / Variation - 10

Every fire sound effect and explosion sound effect has a random detune and is panned according to the position of the sound effect on screen.

### Code Refactoring using JS techniques * - 5
I put some time into learning better js techniques and refactoring code, such as making the ships and rockets stored in arrays so that the update calls and other logic can be all controlled with forEach loops. This would be especially important if I wanted to dynamically expand this game even more.

### Play Scene Music - 5

### Music Interactivity * - 25
I put a great deal of time into learning the Phaser audio API so that I could do a bunch of different things. The audio track is split into 4 different stems which can be controlled individually. For example, when the timer runs out 2 of the stems are muted so you only have a sort of muted skeleton of the audio. Additionally, the detune is controlled in real time at the end of the timer to get the pitch slowing effect, which is dependent on the in game timer. I put a lot of time into figuring this all out and the code I wrote should be modular enough for it to be used even more.

### TOTAL - 110

'*' = Custom / proposed additions
