export type Hex = {
    terrain: string,
    player_visible: boolean,
    primary_creature: (string | null),
    climate: (string | null),
    settlement: (Settlement | null),
    wildness: string
    rivers: [string, string, string, string, string, string],
    roads: [string, string, string, string, string, string],
    position: NormalCoord
}

export function EmptyHex(position: [number, number] = [0, 0]): Hex {
    return {
        'terrain': 'empty',
        'player_visible': false,
        'primary_creature': null,
        'climate': null,
        'settlement': null,
        'wildness': '',
        'rivers': ['none', 'none', 'none', 'none', 'none', 'none'],
        'roads': ['none', 'none', 'none', 'none', 'none', 'none'],
        'position': {'col': position[0], 'row': position[1]}}
}

export type HexGrid = {
    array: Hex[][],
    offset: [number, number],
    first_is_up: boolean
}

export function EmptyHexGrid(n_rows: number, n_cols: number, offset: [number, number] = [0, 0]): HexGrid {
    let array: Hex[][] = Array<Hex[]>(0)
    for (let row = 0; row < n_rows; row++) {
        let new_row = Array<Hex>(0);
        for (let col = 0; col < n_cols; col++) {
            new_row = new_row.concat([EmptyHex([col + offset[0], row + offset[1]])]);
        }
        array = array.concat([new_row])
    }
    return {'array': array, 'offset': offset, 'first_is_up': true};
}

export type Brush = {
    property: (string | null)
    value: (string | boolean)
}

export type Cursor = {
    function: (Function | null)
    tigger_on_move: boolean
    edits: boolean
}

export type Settlement = {
    name: string,
    type: string
}

export type HexGridView = {
    offset_x: number,
    offset_y: number,
    scale: number,
    show_terrain: boolean,
    show_coordinates: boolean
    player_view: boolean
    show_settlements: boolean
    show_settlement_names: boolean
    show_rivers: boolean
    show_roads: boolean
    show_wildness: boolean
}

export type NormalCoord = {
    col: number,
    row: number
}

export type AxialCoord = {
        q: number,
        r: number
    }

export type CubicCoord = {
    q: number,
    r: number,
    s: number
}
export type Point = {
        x: number,
        y: number
    }

export function normalToAxial(coord: NormalCoord, first_is_up: Boolean): AxialCoord {
        let q = coord.col;
        let r = coord.row - (coord.col + (coord.col & 1)) / 2;
        if (first_is_up) {
            r = coord.row - (coord.col - (coord.col & 1)) / 2;
        }
        return {'q': q, 'r': r}
    }

export function axialToNormal(coord: AxialCoord, first_is_up: Boolean): NormalCoord {
        let col = coord.q;
        let row = coord.r + (coord.q + (coord.q & 1)) / 2;
        if (first_is_up) {
            row = coord.r + (coord.q - (coord.q & 1)) / 2;
        }
        return {'col': col, 'row': row}
    }

export function cubicToAxial(coord: CubicCoord): AxialCoord {
        return {'q': coord.q, 'r': coord.r}
    }

export function axialToCubic(coord: AxialCoord): CubicCoord {
        return {'q': coord.q, 'r': coord.r, 's': -coord.q - coord.r}
    }

export function axialRoundOld(coord: AxialCoord): AxialCoord {
        let x = coord.q
        let y = coord.r
        let xgrid = Math.round(x)
        let ygrid = Math.round(y)
        x -= xgrid
        y -= ygrid
        let dx = Math.round(x + 0.5 * y) * +(x * x >= y * y)
        let dy = Math.round(y + 0.5 * x) * +(x * x < y * y)
        return {'q': xgrid + dx, 'r': ygrid + dy}

    }


export function cubicRound(coord: CubicCoord): CubicCoord {
        let q = Math.round(coord.q)
        let r = Math.round(coord.r)
        let s = Math.round(coord.s)
        let q_diff = Math.abs(q - coord.q)
        let r_diff = Math.abs(r - coord.r)
        let s_diff = Math.abs(s - coord.s)

        if ((q_diff > r_diff) && (q_diff > s_diff)) {
            q = -r - s
        } else if (r_diff > s_diff) {
            r = -q - s
        } else {
            s = -q - r
        }
        return {'q': q, 'r': r, 's': s}
    }

export function axialRound(coord: AxialCoord): AxialCoord {
    return cubicToAxial(cubicRound(axialToCubic(coord)))
}