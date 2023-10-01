---
"simpledungeongenerator": patch
---

Major bug fixes

-   Instead of connecting all rooms directly to a single room, the rooms are now connected to the closest room. This fixes the issue where rooms would be connected to rooms on the other side of the map.
-   getCenter now returns the correct Integers instead of Doubles.
-   Fixed room connection logic
-   Removed unused function from Room class
