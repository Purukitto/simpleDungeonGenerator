---
"simpledungeongenerator": patch
---

Change map object

-   Instead of a 2D array of strings storing the tiles, it is now a 2D array of objects storing the tile object. This allows for more information to be stored about each tile, such as the tile's type, etc.
-   Updated other functions to reflect this change
-   Updated old functions to use the easily available information about each tile

Other changes

-   Made proper use of isWall instead of using getTile
