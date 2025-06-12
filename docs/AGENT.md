# Propulsion Level Generation Guide

This guide provides systematic instructions for AI-assisted generation of Propulsion game levels in two phases: cave system creation and object placement.

## Technical Specifications

### Tile System
- **Tile size**: 128x128 pixels
- **Level dimensions**: Minimum 32 x 50 tiles (width x height)
- **Tile values**:
  - `0`: Open space (navigable areas)
  - `2`: Underground cave walls
  - `3`: Surface level with cave entrances

### Boundary Requirements
- **Minimum 6-tile border**: All cave areas must have at least 6 layers of solid tiles on left, right, and bottom edges
- **Surface boundary**: At least 1 row of surface tiles (value 3) above cave entrances

---

# PHASE 1: CAVE SYSTEM CREATION

## Design Principles

### Core Requirements
1. **Interconnected Network**: ALL open spaces (value 0) must be fully connected for gameplay
2. **Multiple Chambers**: Create 3-5 distinct cave chambers of varying sizes
3. **Strategic Layout**: Design interconnected cave system rather than single large cave

### Level Architecture

#### Surface Level (Row 7)
- Use tile value 3 for surface ground level
- Create small entrance openings (1-3 tiles wide)
- Keep most of surface level as solid ground

#### Cave Chamber Types
- **Entry Chamber** (rows 8-11): Small chamber near surface entrance (3x3 to 5x5 tiles)
- **Intermediate Chambers** (rows 12-17): Medium chambers (4x6 to 6x8 tiles) 
- **Deep Chambers** (rows 18+): Larger chambers toward bottom (6x10 to 8x12 tiles)

#### Tunnel Specifications
- **Horizontal tunnels**: 3-4 tiles wide (for primary ship and pod movement)
- **Vertical passages**: 2-3 tiles wide (for tactical maneuvering)
- **Tunnel intersections**: 4+ tiles wide (for turning space)
- **Inter-chamber walls**: 1-2 tile thickness for structural integrity

## Connectivity Validation (CRITICAL)

**Before proceeding to Phase 2**, verify complete connectivity:

### Validation Method
1. Identify all distinct groups of connected zero-value tiles
2. Verify there is only ONE connected group (all zeros interconnected)
3. Test navigation paths: sky → surface → entry → intermediate → deep areas
4. Ensure return paths exist for escape scenarios

### Common Issues to Avoid
- Isolated entry chambers not connected to main cave system
- Disconnected deep areas with no connection to upper levels
- Separated chamber groups with no linking passages
- Blocked vertical access between levels

---

# PHASE 2: OBJECT PLACEMENT

## Technical Requirements

### Object Specifications
- **Object size**: 128x128 pixels
- **Coordinate rule**: All coordinates must be multiples of 128
- **Ground requirement**: Objects must have a ground tile (value 2 or 3) underneath
- **Ship positioning**: 3 tiles above ground level (y = 384 pixels from surface)

### Mandatory Validation Protocol

**BEFORE placing ANY object:**
1. Calculate array position: Column = x ÷ 128, Row = y ÷ 128
2. Extract tile value from data array at calculated index
3. Verify tile value is 2 or 3 (NEVER 0)
4. Document validation: "Object at (x,y) = row R, column C = tile value V"

## Game Design & Object Strategy

### Mission Objectives
1. Navigate gravitational caves
2. Neutralize enemy defenses (turrets)
3. Collect cargo pods (fuel tanks) using tractor beam
4. **Collect the ball** (primary objective)
5. **Destroy primary reactors** (triggers 10-second escape countdown)
6. **Escape before chain reaction** (10-second window)

### Strategic Object Placement

#### Ship Starting Position
- Position 3 tiles above ground level
- Clear initial navigation path into cave system
- Away from immediate threats

#### Fuel Tanks (Cargo Pods)
- Distribute across different cave chambers
- Position adjacent to walls but in open spaces
- Create sequential collection challenges

#### Turrets (Enemy Defenses)
- Guard key passage chokepoints and chamber entrances
- Rotate to face different directions (0°, 90°, 180°, 270°)
- Force tactical maneuvering

#### Reactors (Primary Targets)
- **CRITICAL**: Must allow 10-second escape to exit
- **Location**: Place in upper/intermediate chambers, NOT deepest areas
- **Timing**: Destruction happens AFTER ball collection

#### Ball and Ball Store
- Position at farthest accessible point from ship start
- Same coordinates for both objects
- Can be in deepest chambers (collection before reactor destruction)

#### Lasers and Transformers
- Create additional tactical challenges
- Position in passages to control access
- Group for coordinated defense

## Validation Checklists

### Phase 1 Validation
1. **Boundary Compliance**: Verify 6+ tile layers on edges
2. **Connectivity**: Ensure ALL zero areas are interconnected
3. **Navigation**: Confirm tunnel widths allow ship movement

### Phase 2 Validation
1. **Ground Validation**: Every object has ground tile (2 or 3) underneath
2. **Timing Test**: Reactor-to-exit route completable within 10 seconds
3. **Game Flow**: Fuel → Ball → Reactor → Escape sequence works

## Development Process

### Phase 1: Cave System Creation
1. Design interconnected chambers and passages
2. Validate boundary requirements and connectivity
3. **CRITICAL**: Ensure all zero areas are interconnected
4. No isolated areas allowed before proceeding

### Phase 2: Object Placement
1. Position objects according to strategic placement rules
2. Validate all coordinates against tile map data
3. Ensure gameplay flow and challenge progression

## Best Practices & Common Issues

### Critical Success Factors
- **Connectivity is non-negotiable**: Every open space must be reachable
- **10-second escape rule**: Reactor placement must allow feasible escape
- **Validation methodology**: Always extract actual tile values from data array
- **Ground requirement**: Never place objects on tile value 0

### Common Errors to Avoid
- Creating chambers without proper connecting passages
- Placing reactors too far from exit for 10-second escape
- Trusting coordinate calculations without tile value verification  
- Placing objects on cave entrance openings (tile value 0)

### Proven Architecture Template
- **Sky Area** (rows 0-6): Ship starting and maneuvering space
- **Surface Entrance** (row 7): Strategic openings in surface level
- **Entry Chamber** (rows 8-11): Small chamber connected to surface
- **Main Corridor** (rows 12-17): Wide 4-tile corridor for navigation
- **Vertical Passages** (rows 18-21): Connect levels with 2-3 tile shafts
- **Deep Chambers** (rows 22+): Large chambers for end-game objectives

## Reference
- Examine levels 1-3 for established patterns and placement strategies
- Level 4 demonstrates proper cave connectivity implementation
