import React from "react";

// region TYPES & INTERFACES

// a tile-map is an object with integer indexes mapped to react components, they map the tiles of a workspace to react components
export interface TileMap {
    [index: number]: React.ReactNode
}

// a tile blueprint is an object that describes the configuration of a set of nested tiles. It can either have the keys ('top','bottom') or ('left','right') depending on if it is split horizontally or vertically with the value being another tile blueprint. If it is a leaf tile, it instead has a key 'component' which maps to an integer index of a react component in the tile-map
export interface TileBlueprint {
    top?: TileBlueprint,
    bottom?: TileBlueprint,
    left?: TileBlueprint,
    right?: TileBlueprint,
    component?: number
}

// each type of tile blueprint has its own interface
export interface TileBlueprintTopBottom {
    top: TileBlueprint,
    bottom: TileBlueprint
}

export interface TileBlueprintLeftRight {
    left: TileBlueprint,
    right: TileBlueprint
}

export interface TileBlueprintLeaf {
    component: number
}

// interface for the workspace context
export interface WorkspaceContextInterface {
    // the tile-map
    tilemap?: TileMap,
    // the function used to set the tile-map
    setTilemap?: (action : {type: string, payload: { index: number, component: JSX.Element }}) => void,

}

// endregion

// region CONSTANTS

// the potential tile blueprints available to the user, each will have no more than 3 leaf tiles
export const TILE_BLUEPRINTS: TileBlueprint[] = [
    // one tile to the left, two to the right
    {
        left: {component: 0},
        right: {
            top: {component: 1},
            bottom: {component: 2}
        }
    },
    // two tiles to the left, one to the right
    {
        left: {
            top: {component: 0},
            bottom: {component: 1}
        },
        right: {component: 2}
    },
    // one tile to the top, two to the bottom
    {
        top: {component: 0},
        bottom: {
            left: {component: 1},
            right: {component: 2}
        }
    },
    // two tiles to the top, one to the bottom
    {
        top: {
            left: {component: 0},
            right: {component: 1}
        },
        bottom: {component: 2}
    },
    // one tile at the top, one at the bottom
    {
        top: {component: 0},
        bottom: {component: 1}
    },
    // one tile to the left, one to the right
    {
        left: {component: 0},
        right: {component: 1}
    },
    // one tile
    {component: 0}
];

// the minimum proportional size of a tile
export const MIN_TILE_PROPORTION = 0.25;

// endregion