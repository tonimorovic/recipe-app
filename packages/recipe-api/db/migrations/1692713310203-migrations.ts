import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1692713310203 implements MigrationInterface {
    name = 'Migrations1692713310203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "bio" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "ingredients" jsonb NOT NULL, "instructions" text NOT NULL, "image" character varying NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "recipe_id" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "review" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "recipe_id" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "purchase_date" date NOT NULL, "price" double precision NOT NULL, "payment_method" character varying NOT NULL, "transaction_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "recipe_id" integer, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_recipes_recipe" ("categoryId" integer NOT NULL, "recipeId" integer NOT NULL, CONSTRAINT "PK_59cb73fcb8da19ec36cc49facf1" PRIMARY KEY ("categoryId", "recipeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fad83fdc5221169a730aa97936" ON "category_recipes_recipe" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_352ccbbbbc0256587a592a90e0" ON "category_recipes_recipe" ("recipeId") `);
        await queryRunner.query(`CREATE TABLE "list_recipes_recipe" ("listId" integer NOT NULL, "recipeId" integer NOT NULL, CONSTRAINT "PK_564022497731938cc53906a43ae" PRIMARY KEY ("listId", "recipeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e98ccd1f40b328f9a3d8e71479" ON "list_recipes_recipe" ("listId") `);
        await queryRunner.query(`CREATE INDEX "IDX_524ed0ede6e8c1bb90203becef" ON "list_recipes_recipe" ("recipeId") `);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_385770dfbf5b275c495dd298546" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_419a340a4ab516dd2536981e01e" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_18ae36b989f9f259d4e3d34f1ca" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_c4f9e58ae516d88361b37ed9532" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_bcfb846e60f0a92bb2179f01360" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "FK_a842f768ec87a346b0ee61fabba" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_recipes_recipe" ADD CONSTRAINT "FK_fad83fdc5221169a730aa979365" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_recipes_recipe" ADD CONSTRAINT "FK_352ccbbbbc0256587a592a90e0e" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "list_recipes_recipe" ADD CONSTRAINT "FK_e98ccd1f40b328f9a3d8e714792" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "list_recipes_recipe" ADD CONSTRAINT "FK_524ed0ede6e8c1bb90203becef9" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_recipes_recipe" DROP CONSTRAINT "FK_524ed0ede6e8c1bb90203becef9"`);
        await queryRunner.query(`ALTER TABLE "list_recipes_recipe" DROP CONSTRAINT "FK_e98ccd1f40b328f9a3d8e714792"`);
        await queryRunner.query(`ALTER TABLE "category_recipes_recipe" DROP CONSTRAINT "FK_352ccbbbbc0256587a592a90e0e"`);
        await queryRunner.query(`ALTER TABLE "category_recipes_recipe" DROP CONSTRAINT "FK_fad83fdc5221169a730aa979365"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "FK_a842f768ec87a346b0ee61fabba"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_bcfb846e60f0a92bb2179f01360"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_c4f9e58ae516d88361b37ed9532"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_18ae36b989f9f259d4e3d34f1ca"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_419a340a4ab516dd2536981e01e"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_385770dfbf5b275c495dd298546"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_524ed0ede6e8c1bb90203becef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e98ccd1f40b328f9a3d8e71479"`);
        await queryRunner.query(`DROP TABLE "list_recipes_recipe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_352ccbbbbc0256587a592a90e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fad83fdc5221169a730aa97936"`);
        await queryRunner.query(`DROP TABLE "category_recipes_recipe"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
