import React, {useReducer} from "react";
import {TILE_BLUEPRINTS, TileBlueprint, TileBlueprintTopBottom, TileMap} from "./workspace_docs";
import {WorkspaceContext} from "./workspace_context";
import Tile from "./TileComponents";


export const KNOWLEDGE_COMPONENTS = {
    TEXT: <div className={'knowledge-component'}>1</div>,
    TREE: <div className={'knowledge-component'}>2</div>,
    CARD: <div className={'knowledge-component'}>3</div>,
}


export type BlueprintReducerAction =
    { type: 'SET', payload: number } |
    { type: 'RESIZE', payload: { tile_id: string, ratio: number } };

export type TileIdCoordinate = 't' | 'b' | 'l' | 'r';

// region REDUCERS

// a reducer function for the tilemap
function tilemapReducer(state: TileMap, action: {
    type: string,
    payload: { index: number, component: JSX.Element }
}): TileMap {
    switch (action.type) {
        case 'SET':
            return {...state, [action.payload.index]: action.payload.component};
        default:
            return state;
    }
}


// a reducer function for the tile blueprint
function tileBlueprintReducer(state: TileBlueprint, action: BlueprintReducerAction): TileBlueprint {
    switch (action.type) {
        case 'SET':
            // if the index >= the number of potential blueprints, throw an error
            if (action.payload >= Object.keys(TILE_BLUEPRINTS).length) {
                throw new Error(`Invalid index ${action.payload} for tile blueprint`);
            }
            return TILE_BLUEPRINTS[action.payload];
        case 'RESIZE':
            const new_state = {...state};
            // get the coords part of the tile_id
            const coords = action.payload.tile_id.split('_')[1];
            // map the directions to the corresponding code
            const coords_map = {t: 'top', b: 'bottom', l: 'left', r: 'right'};
            const resized_tile = (coords.split('') as TileIdCoordinate[]).reduce(
                (tile : TileBlueprint, coord : TileIdCoordinate) => {
                    // if tile does not have coords_map[coord], throw an error
                    if (!tile.hasOwnProperty(coords_map[coord])) {
                        throw new Error(`Invalid tile_id ${action.payload.tile_id} for tile blueprint ${state}`);
                    }
                    return tile[coords_map[coord] as keyof TileBlueprint] as TileBlueprint;
                }, new_state
            );
            resized_tile.tile_ratio = action.payload.ratio;
            return new_state;
        default:
            return state;
    }
}

// endregion

/**
 * the workspace component that is the main content of the home page
 * @constructor
 */
export default function Workspace() {
    // ? CONSTANTS AND STATES
    const [tilemap, setTilemap] = useReducer(
        tilemapReducer,
        {
            0: KNOWLEDGE_COMPONENTS.TEXT,
            1: KNOWLEDGE_COMPONENTS.TREE,
            2: KNOWLEDGE_COMPONENTS.CARD,
        });

    const [tile_blueprint, setTileBlueprint] = useReducer(
        tileBlueprintReducer,
        TILE_BLUEPRINTS[0]
    );


    return (
        <div className={'workspace-box'}>
            <div className={'query-box'}>
                <input type={'text'} placeholder={'Query'}/>
                <button>Digest</button>
            </div>
            <WorkspaceContext.Provider value={{tilemap, setTilemap, setTileBlueprint}}>
                <div className={'knowledge-box'}>
                    <div className={'tile-box'}>
                        <Tile blueprint={tile_blueprint} tile_id={'tile_'}/>
                    </div>
                    <div className={'blueprint-selection-box'}>
                        {Object.keys(TILE_BLUEPRINTS).map((key: string, index: number) => {
                            return (
                                <div className={'blueprint-btn'} key={index}
                                     onClick={() => setTileBlueprint({type: 'SET', payload: index})}>
                                    {index}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </WorkspaceContext.Provider>
        </div>
    );
}

