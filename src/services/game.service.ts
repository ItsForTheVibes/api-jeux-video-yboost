import * as gameRepository from '../repositories/game.repository.js';
import type {Game, CreateGameInput} from '../models/game.model.js';

export class HttpError extends Error {
    status: number;
    details?: string[];

    constructor(status: number, message: string, details?: string[]) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.details = details;
    }
}

function notFound(): HttpError {
    return new HttpError(404, 'Jeu introuvable');
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (!/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id)) {
        throw new HttpError(400, 'Identifiant invalide', [
            "L'identifiant doit être un entier strictement positif",
        ]);
    }
    return id;
}

function validateGameInput(body: unknown): CreateGameInput {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        throw new HttpError(400, 'Données invalides', ['Le corps de la requête doit être un objet JSON']);
    }

    const data = body as Record<string, unknown>;
    const errors: string[] = [];

    if (typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('Le titre est obligatoire');
    }
    if (typeof data.editor !== 'string' || data.editor.trim() === '') {
        errors.push("L'éditeur est obligatoire");
    }
    if (typeof data.genre !== 'string' || data.genre.trim() === '') {
        errors.push('Le genre est obligatoire');
    }
    if (
        typeof data.releaseYear !== 'number' ||
        !Number.isInteger(data.releaseYear) ||
        data.releaseYear < 1950 ||
        data.releaseYear > 2100
    ) {
        errors.push("L'année de sortie doit être un entier entre 1950 et 2100");
    }
    if (
        typeof data.rating !== 'number' ||
        !Number.isFinite(data.rating) ||
        data.rating < 0 ||
        data.rating > 10
    ) {
        errors.push('La note doit être comprise entre 0 et 10');
    }

    if (errors.length > 0) {
        throw new HttpError(400, 'Données invalides', errors);
    }

    return {
        title: (data.title as string).trim(),
        editor: (data.editor as string).trim(),
        releaseYear: data.releaseYear as number,
        genre: (data.genre as string).trim(),
        rating: data.rating as number,
    };
}

export function getAllGames(): Game[] {
    return gameRepository.findAll();
}

export function getGameById(rawId: string): Game {
    const id = parseId(rawId);
    const game = gameRepository.findById(id);
    if (!game) throw notFound();
    return game;
}

export function createGame(body: unknown): Game {
    const input = validateGameInput(body);
    return gameRepository.create(input);
}

export function updateGame(rawId: string, body: unknown): Game {
    const id = parseId(rawId);
    if (!gameRepository.findById(id)) throw notFound();
    const input = validateGameInput(body);
    const updated = gameRepository.update(id, input);
    if (!updated) throw notFound();
    return updated;
}

export function deleteGame(rawId: string): void {
    const id = parseId(rawId);
    if (!gameRepository.deleteById(id)) throw notFound();
}
