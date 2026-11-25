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