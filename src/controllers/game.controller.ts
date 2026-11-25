import type {Request, Response} from 'express';
import * as gameService from '../services/game.service.js';

export function listGames(_req: Request, res: Response) {
    res.status(200).json(gameService.getAllGames());
}

export function getGame(req: Request<{id: string}>, res: Response) {
    res.status(200).json(gameService.getGameById(req.params.id));
}

export function createGame(req: Request, res: Response) {
    res.status(201).json(gameService.createGame(req.body));
}

export function updateGame(req: Request<{id: string}>, res: Response) {
    res.status(200).json(gameService.updateGame(req.params.id, req.body));
}

export function deleteGame(req: Request<{id: string}>, res: Response) {
    gameService.deleteGame(req.params.id);
    res.status(204).end();
}