import express from 'express';
import type {Request, Response, NextFunction} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from './config/paths.js';
import {gameRoutes} from './routes/game.routes.js';
import {HttpError} from './services/game.service.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({message: 'API Jeux Vidéo opérationnelle'});
});

const swaggerPath = path.join(projectRoot, 'docs/openapi.yaml');
const swaggerText = fs.readFileSync(swaggerPath, 'utf8');
const document = YAML.parse(swaggerText);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(document));

app.use('/api/games', gameRoutes);

app.use((_req, res) => {
    res.status(404).json({error: 'Route introuvable'});
});

interface RequestError extends Error {
    type?: string;
    status?: number;
}

function handleError(err: RequestError, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpError) {
        res.status(err.status).json({error: err.message, details: err.details});
        return;
    }
    if (err.type === 'entity.parse.failed') {
        res.status(400).json({error: 'JSON invalide'});
        return;
    }
    if (err.status && err.status >= 400 && err.status < 500) {
        let message = 'Requête invalide';
        if (err.status === 413) {
            message = 'Corps de requête trop volumineux';
        }
        res.status(err.status).json({error: message});
        return;
    }
    console.error(err);
    res.status(500).json({error: 'Erreur interne du serveur'});
}

app.use(handleError);