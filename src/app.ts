import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from './config/paths.js';

const swaggerPath = path.join(projectRoot, 'docs/openapi.yaml');
const swaggerText = fs.readFileSync(swaggerPath, 'utf8');
const document = YAML.parse(swaggerText);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(document));