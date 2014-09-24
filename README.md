Simple Meteor RPG
=================

How this works:

```

||||||||||      |||||||||||||||
|| BOOT || -->  || PRELOADER ||
||||||||||      |||||||||||||||
              /
            /
          |/_

|||||||||||||||      ||||||||||
|| MAIN MENU || -->  || GAME ||
|||||||||||||||      ||||||||||


```

The Simple Meteor RPG is a proof of concept for the Game Programming
with Meteor book by Ivan Montiel.

It is not meant to be used in production, but rather as a teaching tool
for students.

# Client

The client folder contains only JavaScript that runs on the client.
This includes Phaser, since Phaser needs Window needs to be defined.

# Server

The server folder contains JavaScript that only runs on the Meteor
Server.  

The Game.js file takes care of maintaining the game from the standpoint
of the server.  It creates enemies and maintains their health.

