import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1779632602783 implements MigrationInterface {
  name = 'InitialSchema1779632602783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."analyses_analysis_type_enum" AS ENUM('security', 'complexity', 'test-gaps', 'breaking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."analyses_severity_enum" AS ENUM('high', 'medium', 'low', 'info')`,
    );
    await queryRunner.query(
      `CREATE TABLE "analyses" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "analysis_type" "public"."analyses_analysis_type_enum" NOT NULL, "file_path" character varying NOT NULL, "line_number" integer, "severity" "public"."analyses_severity_enum", "explanation" text, "fix_suggestion" text, "github_comment_id" integer, "pullRequestId" uuid, CONSTRAINT "PK_91421900ca225ed9865d016a940" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."analysis_jobs_worker_type_enum" AS ENUM('security', 'complexity', 'test-gaps', 'breaking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."analysis_jobs_status_enum" AS ENUM('queued', 'running', 'done', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "analysis_jobs" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "worker_type" "public"."analysis_jobs_worker_type_enum" NOT NULL, "status" "public"."analysis_jobs_status_enum" NOT NULL DEFAULT 'queued', "bull_job_id" character varying, "started_at" TIMESTAMP, "completed_at" TIMESTAMP, "error" text, "pullRequestId" uuid, CONSTRAINT "PK_ed5ebf2c133df30c3fb2f633836" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pull_requests_workflow_status_enum" AS ENUM('pending', 'analyzing', 'complete', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pull_requests" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "github_pr_id" integer NOT NULL, "github_pr_number" integer NOT NULL, "repo_full_name" character varying NOT NULL, "title" character varying, "author" character varying, "base_branch" character varying, "head_sha" character varying, "workflow_status" "public"."pull_requests_workflow_status_enum" NOT NULL DEFAULT 'pending', "quality_score" integer, "analyzed_at" TIMESTAMP, "workspaceId" uuid, CONSTRAINT "PK_e8a8aa8710c3a9650a19a9c2e7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."workspaces_plan_enum" AS ENUM('free', 'pro', 'enterprise')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workspaces" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "github_org" character varying, "plan" "public"."workspaces_plan_enum" NOT NULL DEFAULT 'free', CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "analyses" ADD CONSTRAINT "FK_cdc7a9a775cf8bf786fd0ed6ad1" FOREIGN KEY ("pullRequestId") REFERENCES "pull_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analysis_jobs" ADD CONSTRAINT "FK_41e796cd334736bd4a74f02afea" FOREIGN KEY ("pullRequestId") REFERENCES "pull_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pull_requests" ADD CONSTRAINT "FK_a5f00391631858b85a5ff7f1a4d" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pull_requests" DROP CONSTRAINT "FK_a5f00391631858b85a5ff7f1a4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analysis_jobs" DROP CONSTRAINT "FK_41e796cd334736bd4a74f02afea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analyses" DROP CONSTRAINT "FK_cdc7a9a775cf8bf786fd0ed6ad1"`,
    );
    await queryRunner.query(`DROP TABLE "workspaces"`);
    await queryRunner.query(`DROP TYPE "public"."workspaces_plan_enum"`);
    await queryRunner.query(`DROP TABLE "pull_requests"`);
    await queryRunner.query(
      `DROP TYPE "public"."pull_requests_workflow_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "analysis_jobs"`);
    await queryRunner.query(`DROP TYPE "public"."analysis_jobs_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."analysis_jobs_worker_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "analyses"`);
    await queryRunner.query(`DROP TYPE "public"."analyses_severity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."analyses_analysis_type_enum"`);
  }
}
