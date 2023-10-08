# simpledungeongenerator

## 0.9.0

### Minor Changes

- 0426630: New bundles setup

## 0.8.0

### Minor Changes

- de43056: Regions and doors for connections

  - Fixes
    - Removed uncessary tiles
    - Fixed default values for main contructor
    - Fixed room boundary function logic
  - Added Regions logic
    - All rooms and corridors are now part of a region
    - Regions are connected by doors
    - Small chance of regions to be connected by path
  - Dead end removal logic improved
  - Walls now default to " " instead of "#"
  - Room tries now default to 150 instead of 50 (more rooms)

## 0.7.3

### Patch Changes

- 0f23ec9: Added iife dist for easy browser usage

## 0.7.2

### Patch Changes

- c34231c: Fix

## 0.7.1

### Patch Changes

- 7152d86: Fix entry point for module

## 0.7.0

### Minor Changes

- 085b2e1: Added new draw method and bug fixes

  Details:

  - Default values were fixed for the main instance
  - Added Errors and Warnings for the inputs
  - Fix spelling of "colour" across the project
  - New helper function `getContrastColour` to get black or white colour based on the brightness of the given hex colour.
  - New draw method `drawToSVG` to draw the dungeon to an SVG object.
  - Updated readme with new draw method and removed some unnecessary information.

## 0.6.4

### Patch Changes

- 3700d86: Minor changes

  - Throw error for invalid inputs instead of defaulting to default values
  - Make rng() property private

## 0.6.3

### Patch Changes

- 6826b7b: Fix room connection eating into rooms

## 0.6.2

### Patch Changes

- 34b94b0: Major bug fixes

  - Instead of connecting all rooms directly to a single room, the rooms are now connected to the closest room. This fixes the issue where rooms would be connected to rooms on the other side of the map.
  - getCenter now returns the correct Integers instead of Doubles.
  - Fixed room connection logic
  - Removed unused function from Room class

## 0.6.1

### Patch Changes

- 831f6f1: Fix print with index logic in drawToConsole function

## 0.6.0

### Minor Changes

- 4346821: Connect unconnected rooms and change indexing behaviour

  - Connect unconnected rooms

    - This is done by finding the closest room to the current room and connecting them

  - Change indexing behaviour
    - The indexing behaviour has been changed to be more consistent and easier to understand

## 0.5.0

### Minor Changes

- 6bc4eb7: Better defaults

## 0.4.0

### Minor Changes

- dd4fdfd: Indexing options with number indexing and random colour indexing

## 0.3.2

### Patch Changes

- 28396a0: Change print to drawToConsole

## 0.3.1

### Patch Changes

- 73443ca: Change some defaults

## 0.3.0

### Minor Changes

- e57bf2e: Remove dead ends for paths

## 0.2.0

### Minor Changes

- 4288eda: Create basic path to connect disconnected rooms

## 0.1.1

### Patch Changes

- ec73836: Fix carving function

## 0.1.0

### Minor Changes

- c242edb: Base generation working

### Patch Changes

- 691c6bd: Major bug fixes
- 5f4ac3a: Replaced distanceTo() with overlap() for a better way to check room overlaps
