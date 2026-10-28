import { prisma } from '../config/db';
import { importIndiaDirectory } from '../services/indiaDirectory.service';
import { logger } from '../utils/logger';

async function main() {
  const applyChanges = process.argv.includes('--apply');
  const summary = await importIndiaDirectory(!applyChanges);
  logger.info(
    `${applyChanges ? 'Imported' : 'Dry run'} India directory: ${summary.total} records, ` +
      `${summary.create} new, ${summary.update} existing.`,
  );
  if (!applyChanges) logger.info('No records were changed. Re-run with --apply to import.');
}

main()
  .catch((error) => {
    logger.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
