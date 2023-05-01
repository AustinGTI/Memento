import {
    TileBlueprint,
    TileBlueprintLeftRight,
    TileBlueprintLeaf,
    TileBlueprintTopBottom,
    TileMap, MIN_TILE_PROPORTION
} from "./workspace_docs";
import React, {MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {WorkspaceContext} from "./workspace_context";
import {Simulate} from "react-dom/test-utils";
import mouseMove = Simulate.mouseMove;
import mouseDown = Simulate.mouseDown;


type SeperatorProps = {
    orientation: 'horizontal' | 'vertical',
    ref: React.RefObject<HTMLDivElement>,
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void,
}

// a separator component that separates 2 tiles and allows the user to drag the separator to resize the tiles
function Separator({orientation, ref, onMouseDown, onMouseMove}: SeperatorProps): JSX.Element {
    return (
        <div ref={ref} onMouseDown={onMouseDown} onMouseMove={onMouseMove} className={`separator ${orientation}`}/>
    )
}


// a top-bottom tile component that splits the parent tile into 2 tiles
function TopBottomTile({blueprint, style}: {
    blueprint: TileBlueprintTopBottom, style: {
        height?: number,
        width?: number,
    }
}): JSX.Element {
    const tile_ref = useRef<HTMLDivElement>(null);
    const separator_ref = useRef<HTMLDivElement>(null);
    // the relative heights of the top and bottom tiles must add up to 100%
    const [relative_tile_heights, setRelativeTileHeights] = useState([50, 50]);
    const [is_dragging, setIsDragging] = useState(false);

    // a function to run when the mousedown event is triggered on the separator
    const handleSeparatorMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
    }, []);

    // a function to run when the mouseup event is triggered on the separator
    const handleSeparatorMouseUp = useCallback((e: MouseEvent) => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (is_dragging && tile_ref.current && separator_ref.current) {
            const tile_rect = tile_ref.current.getBoundingClientRect();
            // get the distance between the top of the tile and the mouse
            const tile_top_to_mouse = e.clientY - tile_rect.top;
            // get the proportion by dividing the distance by the height of the tile
            const proportion = tile_top_to_mouse / tile_rect.height;
            // constrain the proportion to be between within MIN_TILE_PROPORTION and 1 - MIN_TILE_PROPORTION
            const constrained_proportion = Math.min(Math.max(proportion, MIN_TILE_PROPORTION), 1 - MIN_TILE_PROPORTION);
            // set the relative tile heights
            setRelativeTileHeights([constrained_proportion * 100, (1 - constrained_proportion) * 100]);
        }
    }, [is_dragging]);

    const tile_style = useMemo(() => {
        if (style.height) {
            return {height: `${style.height}%`}
        } else if (style.width) {
            return {width: `${style.width}%`}
        } else {
            return {}
        }
    }, [style]);

    // add the mouse up event listener to the document so that the user can drag the separator outside
    // the tile
    useEffect(() => {
        document.addEventListener('mouseup', handleSeparatorMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleSeparatorMouseUp);
        }
    }, [handleSeparatorMouseUp]);


    return (
        <div ref={tile_ref} className={'tb-tile'} style={tile_style}>
            <Tile blueprint={blueprint.top} style={{height: relative_tile_heights[0]}}/>
            <Separator
                ref={separator_ref}
                onMouseDown={handleSeparatorMouseDown}
                onMouseMove={handleMouseMove}
                orientation={'horizontal'}/>

            <Tile blueprint={blueprint.bottom} style={{height: relative_tile_heights[1]}}/>
        </div>
    )
}

// a left-right tile component that splits the parent tile into 2 tiles
function LeftRightTile({blueprint, style}: {
    blueprint: TileBlueprintLeftRight, style: {
        height?: number,
        width?: number,
    }
}): JSX.Element {
    const tile_ref = useRef<HTMLDivElement>(null);
    const separator_ref = useRef<HTMLDivElement>(null);
    // the relative heights of the top and bottom tiles must add up to 100%
    const [relative_tile_widths, setRelativeTileWidths] = useState([50, 50]);
    const [is_dragging, setIsDragging] = useState(false);

    // a function to run when the mousedown event is triggered on the separator
    const handleSeparatorMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
    }, []);

    // a function to run when the mouseup event is triggered on the separator
    const handleSeparatorMouseUp = useCallback((e: MouseEvent) => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (is_dragging && tile_ref.current && separator_ref.current) {
            const tile_rect = tile_ref.current.getBoundingClientRect();
            // get the distance between the left of the tile and the mouse
            const tile_left_to_mouse = e.clientX - tile_rect.left;
            // get the proportion by dividing the distance by the height of the tile
            const proportion = tile_left_to_mouse / tile_rect.height;
            // constrain the proportion to be between within MIN_TILE_PROPORTION and 1 - MIN_TILE_PROPORTION
            const constrained_proportion = Math.min(Math.max(proportion, MIN_TILE_PROPORTION), 1 - MIN_TILE_PROPORTION);
            // set the relative tile heights
            setRelativeTileWidths([constrained_proportion * 100, (1 - constrained_proportion) * 100]);
        }
    }, [is_dragging]);

    const tile_style = useMemo(() => {
        if (style.height) {
            return {height: `${style.height}%`}
        } else if (style.width) {
            return {width: `${style.width}%`}
        } else {
            return {}
        }
    }, [style]);

    // add the mouse up event listener to the document so that the user can drag the separator outside
    // the tile
    useEffect(() => {
        document.addEventListener('mouseup', handleSeparatorMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleSeparatorMouseUp);
        }
    }, [handleSeparatorMouseUp]);
    return (
        <div className={'lr-tile'} style={tile_style}>
            <Tile blueprint={blueprint.left} style={{width: relative_tile_widths[0]}}/>
            <Separator
                orientation={'vertical'}
                onMouseMove={handleMouseMove}
                onMouseDown={handleSeparatorMouseDown}
                ref={separator_ref}/>
            <Tile blueprint={blueprint.right} style={{width: relative_tile_widths[1]}}/>
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
export default function Tile({blueprint, style}: {
    blueprint: TileBlueprint, style: {
        width?: number,
        height?: number,
    }
}): JSX.Element {
    // if the blueprint contains the keys 'top' and 'bottom', then it is a top-bottom tile
    if ('top' in blueprint && 'bottom' in blueprint) {
        return <TopBottomTile blueprint={blueprint as TileBlueprintTopBottom} style={style}/>
    }
    // if the blueprint contains the keys 'left' and 'right', then it is a left-right tile
    else if ('left' in blueprint && 'right' in blueprint) {
        return <LeftRightTile blueprint={blueprint as TileBlueprintLeftRight} style={style}/>
    }
    // else, it is a terminal tile
    else {
        return <LeafTile blueprint={blueprint as TileBlueprintLeaf}/>
    }
}
