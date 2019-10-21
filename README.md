# mod-3_game
project for module 3 of flatiron school

If you are loading up the code on your computer, rails db:migrate and rails:db seed in the backend folder. In 'frontend/src/variables.js', you will have to change the userURL and savefilesURL to whatever URL your database uses (localhost:3000 is default for using rails on localhost)

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
character max walking height doesn't changed based on background (looks like characters are walking in the sky)
implement bcrypt
add bosses
change database to Postgres instead of SQLite
save image/gif background rather than referencing another url in the css files
