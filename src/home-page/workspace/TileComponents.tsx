import {
    TileBlueprint,
    TileBlueprintLeftRight,
    TileBlueprintLeaf,
    TileBlueprintTopBottom,
    TileMap
} from "./workspace_docs";
import React, {useCallback, useContext} from "react";
import {WorkspaceContext} from "./workspace_context";


// a separator component that separates 2 tiles and allows the user to drag the separator to resize the tiles
function Separator({orientation}: { orientation: 'horizontal' | 'vertical' }): JSX.Element {
    return (
        <div className={`separator ${orientation}`}/>
    )
}


// a top-bottom tile component that splits the parent tile into 2 tiles
function TopBottomTile({blueprint}: { blueprint: TileBlueprintTopBottom}): JSX.Element {
    return (
        <div className={'tb-tile'}>
            <Tile blueprint={blueprint.top}/>
            <Separator orientation={'horizontal'}/>
            <Tile blueprint={blueprint.bottom}/>
        </div>
    )
}

// a left-right tile component that splits the parent tile into 2 tiles
function LeftRightTile({blueprint}: { blueprint: TileBlueprintLeftRight }): JSX.Element {
    return (
        <div className={'lr-tile'}>
            <Tile blueprint={blueprint.left}/>
            <Separator orientation={'vertical'}/>
            <Tile blueprint={blueprint.right}/>
        </div>
    )
}

// a leaf tile component that represents a single knowledge component
function LeafTile({blueprint}: { blueprint: TileBlueprintLeaf}): JSX.Element {
    const {tilemap, setTilemap} = useContext(WorkspaceContext);
    return (
        <div className={'leaf-tile'}>
            {tilemap ? tilemap[blueprint.component] : null}
        </div>
    )
}


// the tile component that represents either a set of nested tiles or knowledge component
export default function Tile({blueprint}: { blueprint: TileBlueprint}): JSX.Element {
    // if the blueprint contains the keys 'top' and 'bottom', then it is a top-bottom tile
    if ('top' in blueprint && 'bottom' in blueprint) {
        return <TopBottomTile blueprint={blueprint as TileBlueprintTopBottom} />
    }
    // if the blueprint contains the keys 'left' and 'right', then it is a left-right tile
    else if ('left' in blueprint && 'right' in blueprint) {
        return <LeftRightTile blueprint={blueprint as TileBlueprintLeftRight}/>
    }
    // else, it is a terminal tile
    else {
        return <LeafTile blueprint={blueprint as TileBlueprintLeaf}/>
    }
}
