
1) On fait les exemples seuls sans shaders OpenGL
2) On rajoute les shaders dans les exemples à la rash sans faire de class ni les wraper
3) On wrape les call OpenGL dans la librairie pour ne laisser que le sfml dans l'exemple
4) On wrape aussi les call sfml qui servent à introduire nos shaders openGL
5) Tada !

![alt text](image.png)

La lib a une partie OpenGL qui va marcher sur toutes les autres librairies. Et il y aura des interfaces ou des abstractions qui vont ajouter du détail pour la librairie ciblée. ex: SFML ajouter des calls spécifiques pour invoquer les shaders. Du coté utilisateur le but etant d'avoir un seul call pour afficher un shader. carré le boss