import { Core } from "@strapi/strapi";
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const SEED_FLAG_FILE = path.join(process.cwd(), ".seed-completed");

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  // bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
     try {

      const forceSeed = process.env.FORCE_SEED === "true";
      // Vérifie si le seed a déjà été exécuté
      const seedAlreadyDone = fs.existsSync(SEED_FLAG_FILE);

      if (seedAlreadyDone && !forceSeed) {
        strapi.log.info("Seed déjà exécuté (fichier flag présent).");
        return;
      }

      const userCount = await strapi.db
        .query("plugin::users-permissions.user")
        .count();
      const isDbEmpty = userCount === 0;

      if (forceSeed || isDbEmpty) {
        strapi.log.info("===== RUNNING AUTOMATIC SEED =====");

        if (forceSeed) {
          strapi.log.info("FORCE_SEED=true → Seeding forcé…");
        }
        if (isDbEmpty) {
          strapi.log.info("DB vide → Seeding initial…");
        }

        // Utilise spawnSync avec input
        const result = spawnSync(
          "yarn",
          ["strapi", "import", "--force", "-f", "./data/export_20250116105447.tar.gz"],
          {
            input: "y\n", // Confirme automatiquement
            stdio: ["pipe", "inherit", "inherit"],
            shell: true,
          }
        );

        if (result.error) {
          throw result.error;
        }

          // Crée le fichier flag
        fs.writeFileSync(SEED_FLAG_FILE, new Date().toISOString());

        strapi.log.info("===== SEED COMPLETE =====");
      } else {
        strapi.log.info("Seed ignoré : DB non-vide et FORCE_SEED=false.");
      }
    } catch (error) {
      strapi.log.error("Erreur pendant le seed automatique :", error);
    }
  },
};
