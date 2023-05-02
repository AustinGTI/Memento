import {
    TileBlueprint,
    TileBlueprintLeftRight,
    TileBlueprintLeaf,
    TileBlueprintTopBottom,
    TileMap
} from "./workspace_docs";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {WorkspaceContext} from "./workspace_context";


// a separator component that separates 2 tiles and allows the user to drag the separator to resize the tiles
function Separator({orientation, tile_id, tile_ref}: {
    orientation: 'horizontal' | 'vertical',
    tile_id: string,
    tile_ref: React.RefObject<HTMLDivElement>,
}): JSX.Element {
    const {setTileBlueprint} = useContext(WorkspaceContext);
    const [is_dragging, setIsDragging] = useState(false);

    // the ondrag function that resizes the tiles
    const onDragSeparator = useCallback((e: MouseEvent) => {
        // if not dragging, do nothing
        if (!is_dragging) return;
        const tile_rect = tile_ref.current?.getBoundingClientRect();
        // if tile_rect is undefined, throw an error
        if (!tile_rect) throw new Error(`Invalid tile_rect for tile ${tile_id}, returned tile_ref is ${tile_ref.current}`);
        // get the new ratio of the tiles
        const new_ratio = orientation === 'horizontal' ?
            (e.clientY - tile_rect.top) / tile_rect.height :
            (e.clientX - tile_rect.left) / tile_rect.width;
        // if new_ratio is invalid, do nothing
        if (new_ratio <= 0 || new_ratio >= 1) return;
        // set the new ratio of the tiles
        setTileBlueprint!({type: 'RESIZE', payload: {tile_id, ratio: new_ratio}});
    }, [is_dragging, tile_ref, tile_id]);

    // the stop dragging function that stops dragging
    const stopDragging = useCallback(() => setIsDragging(false), []);

    // on mouse up anywhere on the screen, stop dragging
    useEffect(() => {
        window.addEventListener('mouseup', stopDragging);
        // on mouse move anywhere on the screen, resize the tiles
        window.addEventListener('mousemove', onDragSeparator);

        return () => {
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('mousemove', onDragSeparator);
        };
    }, [onDragSeparator, stopDragging]);

    return (
        <div className={`separator ${orientation}`}>
            <div className={'separator-line'} onMouseDown={() => setIsDragging(true)}/>
        </div>
    )
}


// a top-bottom tile component that splits the parent tile into 2 tiles
function TopBottomTile({blueprint, tile_id}: { blueprint: TileBlueprintTopBottom, tile_id: string }): JSX.Element {
    const tile_ref = useRef<HTMLDivElement>(null);
    // set the relative heights of the top and bottom tiles when blueprint.tile_ratio changes
    useEffect(() => {
        const [top_tile, _, bottom_tile] = tile_ref.current!.children;
        top_tile.setAttribute('style', `height: ${blueprint.tile_ratio * 100}%`);
        bottom_tile.setAttribute('style', `height: ${100 - blueprint.tile_ratio * 100}%`);
    }, [blueprint.tile_ratio]);

    return (
        <div className={'tb-tile'} ref={tile_ref}>
            <Tile blueprint={blueprint.top} tile_id={tile_id + 't'}/>
            <Separator orientation={'horizontal'} tile_id={tile_id}
                       tile_ref={tile_ref}/>
            <Tile blueprint={blueprint.bottom} tile_id={tile_id + 'b'}/>
        </div>
    )
}

// a left-right tile component that splits the parent tile into 2 tiles
function LeftRightTile({blueprint, tile_id}: { blueprint: TileBlueprintLeftRight, tile_id: string }): JSX.Element {
    const tile_ref = useRef<HTMLDivElement>(null);
    // set the relative widths of the left and right tiles when blueprint.tile_ratio changes
    useEffect(() => {
        const [left_tile, _, right_tile] = tile_ref.current!.children;
        left_tile.setAttribute('style', `width: ${blueprint.tile_ratio * 100}%`);
        right_tile.setAttribute('style', `width: ${100 - blueprint.tile_ratio * 100}%`);
    }, [blueprint.tile_ratio]);

    return (
        <div className={'lr-tile'} ref={tile_ref}>
            <Tile blueprint={blueprint.left} tile_id={tile_id + 'l'}/>
            <Separator orientation={'vertical'} tile_id={tile_id}
                       tile_ref={tile_ref}/>
            <Tile blueprint={blueprint.right} tile_id={tile_id + 'r'}/>
        </div>
    )
}

// a leaf tile component that represents a single knowledge component
function LeafTile({blueprint}: { blueprint: TileBlueprintLeaf }): JSX.Element {
    const {tilemap, setTilemap} = useContext(WorkspaceContext);
    return (
        <div className={'leaf-tile'}>
            {tilemap ? tilemap[blueprint.component] : null}
        </div>
    )
}


// the tile component that represents either a set of nested tiles or knowledge component
export default function Tile({blueprint, tile_id}: { blueprint: TileBlueprint, tile_id: string }): JSX.Element {
    // if the blueprint contains the keys 'top' and 'bottom', then it is a top-bottom tile
    if ('top' in blueprint && 'bottom' in blueprint) {
        return <TopBottomTile blueprint={blueprint as TileBlueprintTopBottom} tile_id={tile_id}/>
    }
    // if the blueprint contains the keys 'left' and 'right', then it is a left-right tile
    else if ('left' in blueprint && 'right' in blueprint) {
        return <LeftRightTile blueprint={blueprint as TileBlueprintLeftRight} tile_id={tile_id}/>
    }
    // else, it is a terminal tile
    else {
        return <LeafTile blueprint={blueprint as TileBlueprintLeaf}/>
    }
}
