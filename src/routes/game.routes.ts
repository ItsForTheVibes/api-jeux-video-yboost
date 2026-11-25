import {Router} from 'express';
import {listGames, getGame, createGame, updateGame, deleteGame} from '../controllers/game.controller.js';

export const gameRoutes = Router();

gameRoutes.get('/', listGames);
gameRoutes.get('/:id', getGame);
gameRoutes.post('/', createGame);
gameRoutes.put('/:id', updateGame);
gameRoutes.delete('/:id', deleteGame);