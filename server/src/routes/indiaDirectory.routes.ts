import { Router } from 'express';
import { listIndiaDirectoryEntries } from '../controllers/indiaDirectory.controller';

const router = Router();

router.get('/', listIndiaDirectoryEntries);

export default router;
