These instructions are intended for the AI to generate Propulsion level maps in two phases:

# PHASE 1: CAVE SYSTEM CREATION

## Core Technical Requirements for Cave Design

1. A tile is 128x128 pixels
2. Level must be at least 32 x 50 tiles (width x height)
3. Cave system must be surrounded left, right and at the bottom with at least 6 layers of tiles
4. Use tile value 2 for underground cave walls
5. Use tile value 3 for surface level with cave entrances
6. Use tile value 0 for open spaces (navigable areas)
7. **CRITICAL**: ALL zero (open space) areas must be fully interconnected for gameplay
8. Design interconnected cave system rather than single large cave

## Cave System Design Principles

### Surface Level Design:
- Row 7 (index 7): Use tile value 3 for surface ground level
- Create small entrance openings (1-3 tiles wide) in surface level
- Keep most of surface level as solid ground (tile value 3)

### Underground Cave Network:
- **Multiple Chambers**: Create 3-5 distinct cave chambers of varying sizes
- **Connecting Passages**: Link chambers with wider tunnels for ship navigation:
  - **Horizontal tunnels**: 3-4 tiles wide (for primary ship and pod movement)
  - **Vertical passages**: 2-3 tiles wide (for tactical maneuvering)
  - **Tunnel intersections**: 4+ tiles wide (for turning space)
- **Progressive Depth**: Deeper chambers can be larger, surface chambers smaller
- **Strategic Chokepoints**: Use narrower sections within wider tunnels for challenges

### Cave Chamber Specifications:
- **Entry Chamber**: Small chamber near surface entrance (3x3 to 5x5 tiles)
- **Intermediate Chambers**: Medium chambers (4x6 to 6x8 tiles) 
- **Deep Chambers**: Larger chambers toward bottom (6x10 to 8x12 tiles)
- **Connection Tunnels**: 
  - **Main horizontal corridors**: 3-4 tiles wide for ship and pod navigation
  - **Vertical shafts**: 2-3 tiles wide for descent/ascent
  - **Access passages**: 2-3 tiles wide connecting chambers to main corridors

### Wall Boundary Requirements:
- **Minimum 6-tile border**: All cave areas must have at least 6 layers of solid tiles (value 2) on:
  - Left edge of map
  - Right edge of map  
  - Bottom edge of map
- **Surface boundary**: At least 1 row of surface tiles (value 3) above cave entrances
- **Inter-chamber walls**: 1-2 tile thickness between chambers for structural integrity

## **CONNECTIVITY VALIDATION (CRITICAL)**

### Mandatory Connectivity Check:
Before proceeding to Phase 2, verify that every zero-value tile is reachable from every other zero-value tile. This ensures:
- Ship can navigate from sky → surface → all cave areas
- Cargo pods can be collected from any chamber
- Escape routes exist from deepest areas
- No isolated chambers or dead-end areas exist

### Common Connectivity Issues to Avoid:
1. **Isolated Entry Chambers**: Entry chamber not connected to main cave system
2. **Disconnected Deep Areas**: Bottom chambers with no connection to upper levels
3. **Separated Chamber Groups**: Multiple cave groups with no linking passages
4. **Blocked Vertical Access**: Vertical passages that don't connect different levels
5. **Isolated Surface Areas**: Parts of the sky area cut off from cave entrance

### Connectivity Testing Method:
1. Identify all distinct groups of connected zero-value tiles
2. Verify there is only ONE connected group (all zeros interconnected)
3. Test navigation paths: sky → surface → entry → intermediate → deep areas
4. Ensure return paths exist for escape scenarios

## Phase 1 Validation Checklist:

1. **Boundary Compliance**:
   - Verify 6+ tile layers on left, right, and bottom edges
   - Check surface level has proper tile value 3
   - Confirm cave entrance openings are limited and strategic

2. **Cave System Connectivity** (**MANDATORY VALIDATION**):
   - **PRIMARY CHECK**: Verify ALL zero areas are interconnected
   - Ensure all chambers are reachable from entrance
   - Verify tunnel widths allow ship navigation (3-4 tiles wide for horizontal, 2-3 for vertical)
   - Test that cave system forms coherent network with proper turning space
   - Confirm no isolated chambers or dead-end areas exist

3. **Navigation Challenges**:
   - Confirm wider tunnels allow proper ship and pod movement
   - Verify chambers provide tactical spaces for encounters
   - Ensure progressive difficulty from entrance to deepest areas
   - Test tunnel intersections provide adequate turning space

---

# PHASE 2: OBJECT PLACEMENT

## Core Technical Requirements for Objects

1. An object is 128x128 pixels
2. Coordinates must always be multiples of 128
3. Objects must be positioned next to tiles (built on/adjacent to ground tiles)
4. Object rotation follows rule: underside must be attached to ground tile
5. Ship must be positioned 3 tiles above ground level
6. Objects placed roughly evenly for sequential challenges
7. Ball and ballstore positioned at same coordinates at farthest accessible point

## Critical Validation Rules

## Critical Validation Rules for Object Placement

### Object Positioning Validation
- **ALWAYS verify object coordinates against tile map data**
- Objects must be placed in open spaces (tile value 0) adjacent to walls (tile value 2 or 3)
- **NEVER place objects inside wall tiles**
- Calculate tile position: row = y ÷ 128, column = x ÷ 128 (0-indexed)
- Check tile array data to ensure tile[row][column] = 0 (open space)
- Verify adjacent tiles contain walls for structural support

### Level Design Based on Game Objectives

#### Mission Objectives (from briefing):
- Navigate treacherous gravitational caves
- Neutralize enemy defenses (turrets)
- Collect cargo pods (fuel tanks) using tractor beam
- Destroy primary reactors
- Escape before catastrophic chain reaction

#### Object Placement Strategy:

**Ship Starting Position:**
- Place 3 tiles above ground level (y = 384 pixels from surface)
- Position for clear initial navigation path into cave system
- Away from immediate threats
- Above cave entrance area

**Fuel Tanks (Cargo Pods):**
- Distribute across different cave chambers
- Position adjacent to walls but in open spaces
- Create sequential collection challenges
- Require tractor beam to collect (spacebar control)

**Turrets (Enemy Defenses):**
- Guard key passage chokepoints and chamber entrances
- Rotate to face different directions (0°, 90°, 180°, 270°)
- Force player to use tactical maneuvering
- Require photon cannon to destroy (enter key)

**Reactors (Primary Targets):**
- Place in deepest, most defended chambers
- Create challenging approach routes through cave system
- Ensure escape routes exist after destruction
- Position as end-game objectives

**Ball and Ball Store:**
- Position at farthest accessible point from ship start
- Same coordinates for both objects
- Typically in deepest chamber of cave system
- Represents final objective/escape mechanism

**Lasers and Transformers:**
- Use to create additional tactical challenges
- Position in passages to control access
- Group lasers with transformers for coordinated defense

#### Physics and Navigation Considerations:
- Momentum-based ship physics require careful thrust management
- Gravitational effects influence movement in caves
- Fuel consumption limits available maneuvering
- Tractor beam power consumption affects strategy

## Phase 2 Validation Checklist:

1. **Before placing any object:**
   - Calculate exact tile coordinates
   - Verify tile map data at those coordinates
   - Ensure tile value is 0 (open space)
   - Check adjacent tiles for structural support

2. **Level flow validation:**
   - Ensure progressive difficulty from ship through cave system
   - Verify all fuel tanks are accessible via open passages
   - Confirm turret coverage creates meaningful challenges
   - Test that escape routes exist after reactor destruction

3. **Technical compliance:**
   - All coordinates are multiples of 128
   - All objects properly rotated and positioned
   - Ship placement follows elevation rules (3 tiles above ground)
   - Ball/ballstore at same coordinates in farthest location

## Development Process:

**Phase 1**: Focus entirely on creating the cave system tile map
- Design interconnected chambers and passages
- Validate boundary requirements and connectivity
- **CRITICAL**: Perform connectivity validation to ensure all zero areas are interconnected
- Agree on cave layout before proceeding (no isolated areas allowed)

**Phase 2**: Place all objects within the approved cave system  
- Position objects according to strategic placement rules
- Validate all coordinates against tile map data
- Ensure gameplay flow and challenge progression

## Key Lessons Learned:

### Phase 1 Critical Success Factors:
1. **Connectivity is Non-Negotiable**: Every open space must be reachable from every other open space
2. **Common Failure Pattern**: Creating multiple cave chambers without proper connecting passages
3. **Validation Method**: Manually trace navigation paths from sky → surface → all cave areas
4. **Fix Strategy**: Add connecting passages between isolated areas, typically 2-3 tiles wide

### Proven Cave System Architecture:
- **Sky Area** (rows 0-6): Open space for ship starting position and maneuvering
- **Surface Entrance** (row 7): Strategic openings in surface level
- **Entry Chamber** (rows 8-11): Small chamber connected to surface
- **Connecting Passages** (rows 12-13): Link entry chamber to main corridor system
- **Main Horizontal Corridor** (rows 14-17): Wide 4-tile corridor spanning most level width
- **Vertical Passages** (rows 18-21): Connect horizontal levels with 2-3 tile wide shafts
- **Deep Chambers** (rows 22+): Large chambers for end-game objectives

## Reference:
- Examine level 1-3 to understand established patterns and object placement strategies
- Level 4 example demonstrates proper cave connectivity implementation
