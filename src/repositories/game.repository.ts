import {db} from '../database/database.js';
import {Game} from '../models/game.model.js';
import type {CreateGameInput} from '../models/game.model.js';

// Forme d'une ligne telle que SQLite la renvoie (colonnes en snake_case).
interface GameRow {
    id: number;
    title: string;
    editor: string;
    release_year: number;
    genre: string;
    rating: number;
}

// Convertit une ligne SQL en objet Game (release_year -> releaseYear).
function toGame(row: GameRow): Game {
    return new Game(row.id, row.title, row.editor, row.release_year, row.genre, row.rating);
}

export function findAll(): Game[] {
    const rows = db.prepare('SELECT * FROM games ORDER BY id').all() as GameRow[];
    return rows.map(toGame);
}

export function findById(id: number): Game | undefined {
    const row = db.prepare('SELECT * FROM games WHERE id = ?').get(id) as GameRow | undefined;
    return row ? toGame(row) : undefined;
}

export function create(input: CreateGameInput): Game {
    const result = db.prepare(
        'INSERT INTO games (title, editor, release_year, genre, rating) ' +
        'VALUES (@title, @editor, @releaseYear, @genre, @rating)'
    ).run({
        title: input.title,
        editor: input.editor,
        releaseYear: input.releaseYear,
        genre: input.genre,
        rating: input.rating,
    });
    return findById(Number(result.lastInsertRowid)) as Game;
}

export function update(id: number, input: CreateGameInput): Game | undefined {
    const result = db.prepare(
        'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, ' +
        'genre = @genre, rating = @rating WHERE id = @id'
    ).run({
        id,
        title: input.title,
        editor: input.editor,
        releaseYear: input.releaseYear,
        genre: input.genre,
        rating: input.rating,
    });
    if (result.changes === 0) return undefined;
    return findById(id);
}

export function deleteById(id: number): boolean {
    const result = db.prepare('DELETE FROM games WHERE id = ?').run(id);
    return result.changes > 0;
}
