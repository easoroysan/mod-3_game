# mod-3_game
project for module 3 of flatiron school

When loading, rails db:migrate and rails:db seed in the backend folder. Then make sure to change the link in 'frontend/src/variables.js' for animationURL to the full path for your computer of that folder name (folders for animations are in "animations") ex: 'file:///Users/flatironschool/Desktop/mod-3_game/frontend/animations'. The code needs the full path there since it sometimes compares actions based on animations.

Also, in 'variables.js', you will have to change the userURL and savefilesURL to whatever URL your database uses

#sources
knight animations from Warren Clark on itch.io
https://lionheart963.itch.io/4-directional-character

background of homepage from game 'Forsaken Castle' by Duck Block Games

gifs made and edited with https://ezgif.com/

skeleton sprite on death animation from Valdrec on Deviant Art
https://www.deviantart.com/valdrec/art/Skeleton-Sprite-286341831

game background
https://cartoonsmart.com/pixel-art-collection-royalty-free-game-art/

space-bar picture
http://musaraza.com/flappycat/

arrow-keys picture
http://galeotealbert.com/quebec/how-to-fix-keyboard-arrow-keys.php



#Bugs/Improvements
-spamming slash button with no directions glitches character (not sure if this still happens)
-character max walking height doesn't changed based on background (looks like characters are walking in the sky)
-impement bcrypt
-add bosses
-change database to Postgres instead of SQLite
