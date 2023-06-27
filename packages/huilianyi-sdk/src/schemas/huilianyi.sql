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
    form_code            VARCHAR(32)     NULL COLLATE ascii_bin,
    form_name            TEXT            NULL,
    submitted_by         CHAR(36)        NULL COLLATE ascii_bin,
    title                TEXT            NULL,
    created_date         TIMESTAMP       NULL,
    last_modified_date   TIMESTAMP       NULL,
    extras_info          MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    expense_type         INT             NOT NULL COMMENT 'HLY_ExpenseType',
    expense_status       INT             NOT NULL COMMENT 'HLY_ExpenseStatus',
    total_amount         DOUBLE          NOT NULL COMMENT '总金额',
    apply_form_codes_str VARCHAR(256)    NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '关联申请单编号集',
    reload_time          TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    INDEX (form_code),
    INDEX (apply_form_codes_str),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_travel;
CREATE TABLE IF NOT EXISTS hly_travel
(
    hly_id              BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    business_code       VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    application_oid     CHAR(36)        NULL COLLATE ascii_bin,
    applicant_oid       CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name      TEXT            NULL,
    company_oid         CHAR(36)        NULL COLLATE ascii_bin,
    department_oid      CHAR(36)        NULL COLLATE ascii_bin,
    corporation_oid     CHAR(36)        NULL COLLATE ascii_bin,
    form_code           VARCHAR(32)     NULL COLLATE ascii_bin,
    form_oid            CHAR(36)        NULL COLLATE ascii_bin,
    form_name           TEXT            NULL,
    submitted_by        CHAR(36)        NULL COLLATE ascii_bin,
    title               TEXT            NULL,
    created_date        TIMESTAMP       NULL,
    last_modified_date  TIMESTAMP       NULL,
    extras_info         MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    itinerary_items_str MEDIUMTEXT COMMENT '行程单信息，空 | JSON 字符串',
    travel_status       INT             NOT NULL COMMENT 'HLY_TravelStatus',
    reload_time         TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    INDEX (form_code),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_staff;
CREATE TABLE IF NOT EXISTS hly_staff
(
    _rid            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_oid        CHAR(36)        NOT NULL COLLATE ascii_bin,
    employee_id     VARCHAR(64)     NOT NULL COLLATE ascii_bin,
    company_code    VARCHAR(20)     NULL COLLATE ascii_bin,
    full_name       VARCHAR(64)     NOT NULL DEFAULT '',
    email           VARCHAR(128)    NULL COLLATE ascii_bin,
    department_oid  CHAR(36)        NULL COLLATE ascii_bin,
    department_path TEXT            NULL,
    staff_status    INT             NOT NULL COMMENT 'HLY_StaffStatus',
    entry_date      TIMESTAMP       NULL,
    leaving_date    TIMESTAMP       NULL,
    extras_info     MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (user_oid),
    UNIQUE (employee_id),
    INDEX (email),
    INDEX (staff_status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_department;
CREATE TABLE IF NOT EXISTS hly_department
(
    _rid                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_oid        CHAR(36)        NOT NULL COLLATE ascii_bin,
    department_name       VARCHAR(64)     NULL     DEFAULT '',
    department_path       TEXT            NULL,
    manager_oid           CHAR(36)        NULL COLLATE ascii_bin,
    manager_name          VARCHAR(64)     NULL     DEFAULT '',
    department_parent_oid CHAR(36)        NULL COLLATE ascii_bin,
    department_status     INT             NOT NULL COMMENT 'HLY_DepartmentStatus',
    extras_info           MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (department_oid),
    INDEX (department_status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
