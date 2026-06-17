import { Log } from "./log.model";
import type { LogAction } from "./log.model";

class LogRepository {
  async create(
    action: LogAction,
    userId: number | null,
    details: Record<string, unknown> = {},
  ) {
    try {
      await Log.create({ action, user_id: userId, details });
    } catch (err) {
      // On logue l'erreur dans la console serveur, mais on ne la propage pas :
      // un souci MongoDB ne doit jamais faire échouer une action métier.
      console.error("Erreur lors de l'écriture du log MongoDB :", err);
    }
  }

  async readAll() {
    return Log.find().sort({ timestamp: -1 }).limit(100);
  }
}

export default new LogRepository();
