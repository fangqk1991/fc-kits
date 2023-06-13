# CREATE DATABASE `demo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_expense;

CREATE TABLE IF NOT EXISTS hly_expense
(
    hly_id               BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    business_code        VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    application_oid      CHAR(36)        NULL COLLATE ascii_bin,
    applicant_oid        CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name       TEXT            NULL,
    company_oid          CHAR(36)        NULL COLLATE ascii_bin,
    department_oid       CHAR(36)        NULL COLLATE ascii_bin,
    corporation_oid      CHAR(36)        NULL COLLATE ascii_bin,
    form_oid             CHAR(36)        NULL COLLATE ascii_bin,
    form_name            TEXT            NULL,
    submitted_by         CHAR(36)        NULL COLLATE ascii_bin,
    title                TEXT            NULL,
    expense_type         INT             NOT NULL COMMENT 'HLY_ExpenseType',
    expense_status       INT             NOT NULL COMMENT 'HLY_ReimburseStatus',
    total_amount         DOUBLE          NOT NULL COMMENT '总金额',
    created_date         TIMESTAMP       NULL,
    first_submitted_date TIMESTAMP       NULL,
    last_submitted_date  TIMESTAMP       NULL,
    last_modified_date   TIMESTAMP       NULL,
    create_time          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    INDEX (last_modified_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
