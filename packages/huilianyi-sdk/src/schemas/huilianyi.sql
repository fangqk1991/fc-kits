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
    cost_type_oid        CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_oid       CHAR(36)        NULL COLLATE ascii_bin,
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
    INDEX (expense_status),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_public_payment;
CREATE TABLE IF NOT EXISTS hly_public_payment
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
    cost_type_oid        CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_oid       CHAR(36)        NULL COLLATE ascii_bin,
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
    INDEX (expense_status),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_expense_application;
CREATE TABLE IF NOT EXISTS hly_expense_application
(
    hly_id             BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    business_code      VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    application_oid    CHAR(36)        NULL COLLATE ascii_bin,
    applicant_oid      CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name     TEXT            NULL,
    company_oid        CHAR(36)        NULL COLLATE ascii_bin,
    department_oid     CHAR(36)        NULL COLLATE ascii_bin,
    corporation_oid    CHAR(36)        NULL COLLATE ascii_bin,
    form_code          VARCHAR(32)     NULL COLLATE ascii_bin,
    form_oid           CHAR(36)        NULL COLLATE ascii_bin,
    form_name          TEXT            NULL,
    submitted_by       CHAR(36)        NULL COLLATE ascii_bin,
    cost_type_oid      CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_oid     CHAR(36)        NULL COLLATE ascii_bin,
    title              TEXT            NULL,
    created_date       TIMESTAMP       NULL,
    last_modified_date TIMESTAMP       NULL,
    extras_info        MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    form_status        INT             NULL COMMENT 'HLY_ExpenseApplicationStatus',
    total_amount       DOUBLE          NOT NULL COMMENT '总金额',
    reload_time        TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    INDEX (form_code),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_travel;
CREATE TABLE IF NOT EXISTS hly_travel
(
    hly_id                     BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    business_code              VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    application_oid            CHAR(36)        NULL COLLATE ascii_bin,
    applicant_oid              CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name             TEXT            NULL,
    company_oid                CHAR(36)        NULL COLLATE ascii_bin,
    department_oid             CHAR(36)        NULL COLLATE ascii_bin,
    corporation_oid            CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_oid             CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_name            TEXT            NULL,
    form_code                  VARCHAR(32)     NULL COLLATE ascii_bin,
    form_oid                   CHAR(36)        NULL COLLATE ascii_bin,
    form_name                  TEXT            NULL,
    submitted_by               CHAR(36)        NULL COLLATE ascii_bin,
    title                      TEXT            NULL,
    start_time                 TIMESTAMP       NULL COMMENT '开始时间',
    end_time                   TIMESTAMP       NULL COMMENT '结束时间',
    created_date               TIMESTAMP       NULL,
    last_modified_date         TIMESTAMP       NULL,
    extras_info                MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    version                    INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    match_closed_loop          TINYINT         NOT NULL DEFAULT 0 COMMENT '是否满足闭环行程',
    is_pretty                  TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为标准情况',
    is_dummy                   TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为虚拟申请单',
    itinerary_items_str        MEDIUMTEXT COMMENT '行程单信息，空 | JSON 字符串',
    employee_traffic_items_str MEDIUMTEXT COMMENT '员工行程票据信息，空 | JSON 字符串',
    expense_form_codes_str     VARCHAR(256)    NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '关联报销单编号集',
    has_repeated               TINYINT         NOT NULL DEFAULT 0 COMMENT '拥有重复申请单',
    is_newest                  TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为最新',
    overlapped_codes_str       TEXT COLLATE ascii_bin COMMENT '时间重叠的出差申请单',
    is_ignored                 TINYINT         NOT NULL DEFAULT 0 COMMENT '标记为忽略',
    participant_user_oids_str  TEXT COLLATE ascii_bin,
    participant_user_names_str TEXT,
    ticket_id_list_str         TEXT COLLATE ascii_bin,
    travel_status              INT             NOT NULL COMMENT 'HLY_TravelStatus',
    reload_time                TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time                TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time                TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    INDEX (form_code),
    INDEX (start_time),
    INDEX (end_time),
    INDEX (is_dummy),
    INDEX (expense_form_codes_str),
    INDEX (travel_status),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_travel_participant;
CREATE TABLE IF NOT EXISTS hly_travel_participant
(
    _rid          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    business_code VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    user_oid      CHAR(36)        NULL COLLATE ascii_bin,
    create_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code, user_oid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_travel_allowance;
CREATE TABLE IF NOT EXISTS hly_travel_allowance
(
    _rid              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid               CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'business_code + target_month + applicant_oid MD5',
    business_code     VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    target_month      CHAR(7)         NOT NULL COLLATE ascii_bin COMMENT '补贴月份 yyyy-MM',
    applicant_oid     CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name    TEXT            NULL,
    base_city         VARCHAR(64)     NOT NULL DEFAULT '',
    company_oid       CHAR(36)        NULL COLLATE ascii_bin,
    company_name      TEXT            NULL,
    cost_owner_oid    CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_name   TEXT            NULL,
    title             TEXT            NULL,
    start_time        TIMESTAMP       NULL COMMENT '开始时间',
    end_time          TIMESTAMP       NULL COMMENT '结束时间',
    days_count        DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴天数',
    amount            DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴金额',
    detail_items_str  MEDIUMTEXT COMMENT '明细，空 | JSON 字符串',
    use_custom        TINYINT         NOT NULL DEFAULT 0 COMMENT '是否使用自定义数据',
    custom_data_str   MEDIUMTEXT COMMENT '自定义补贴数据',
    extras_info       MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    is_pretty         TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为标准情况',
    is_verified       TINYINT         NOT NULL DEFAULT 0 COMMENT '是否已核验',
    version           INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    allowance_case    INT             NOT NULL DEFAULT 0 COMMENT 'HLY_AllowanceCase',
    without_allowance TINYINT         NOT NULL DEFAULT 0 COMMENT '不发放出差补贴',
    pay_amount        DOUBLE          NOT NULL DEFAULT 0 COMMENT '支付金额',
    batch_no          CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '批次号',
    snap_hash         CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'uid + days_count + amount MD5',
    create_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (uid),
    UNIQUE (business_code, target_month, applicant_oid),
    INDEX (target_month),
    INDEX (applicant_oid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_allowance_draft;
CREATE TABLE IF NOT EXISTS hly_allowance_draft
(
    _rid              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid               CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'business_code + target_month + applicant_oid MD5',
    business_code     VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    target_month      CHAR(7)         NOT NULL COLLATE ascii_bin COMMENT '补贴月份 yyyy-MM',
    applicant_oid     CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name    TEXT            NULL,
    base_city         VARCHAR(64)     NOT NULL DEFAULT '',
    company_oid       CHAR(36)        NULL COLLATE ascii_bin,
    company_name      TEXT            NULL,
    cost_owner_oid    CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_name   TEXT            NULL,
    title             TEXT            NULL,
    start_time        TIMESTAMP       NULL COMMENT '开始时间',
    end_time          TIMESTAMP       NULL COMMENT '结束时间',
    days_count        DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴天数',
    amount            DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴金额',
    detail_items_str  MEDIUMTEXT COMMENT '明细，空 | JSON 字符串',
    use_custom        TINYINT         NOT NULL DEFAULT 0 COMMENT '是否使用自定义数据',
    custom_data_str   MEDIUMTEXT COMMENT '自定义补贴数据',
    extras_info       MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    is_pretty         TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为标准情况',
    is_verified       TINYINT         NOT NULL DEFAULT 0 COMMENT '是否已核验',
    version           INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    allowance_case    INT             NOT NULL DEFAULT 0 COMMENT 'HLY_AllowanceCase',
    without_allowance TINYINT         NOT NULL DEFAULT 0 COMMENT '不发放出差补贴',
    pay_amount        DOUBLE          NOT NULL DEFAULT 0 COMMENT '支付金额',
    batch_no          CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '批次号',
    snap_hash         CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'uid + days_count + amount MD5',
    create_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (uid),
    UNIQUE (business_code, target_month, applicant_oid),
    INDEX (target_month),
    INDEX (applicant_oid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_allowance_snapshot;
CREATE TABLE IF NOT EXISTS hly_allowance_snapshot
(
    _rid              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid               CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'business_code + target_month + applicant_oid MD5',
    business_code     VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    target_month      CHAR(7)         NOT NULL COLLATE ascii_bin COMMENT '补贴月份 yyyy-MM',
    applicant_oid     CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name    TEXT            NULL,
    base_city         VARCHAR(64)     NOT NULL DEFAULT '',
    company_oid       CHAR(36)        NULL COLLATE ascii_bin,
    company_name      TEXT            NULL,
    cost_owner_oid    CHAR(36)        NULL COLLATE ascii_bin,
    cost_owner_name   TEXT            NULL,
    title             TEXT            NULL,
    start_time        TIMESTAMP       NULL COMMENT '开始时间',
    end_time          TIMESTAMP       NULL COMMENT '结束时间',
    days_count        DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴天数',
    amount            DOUBLE          NOT NULL DEFAULT 0 COMMENT '补贴金额',
    detail_items_str  MEDIUMTEXT COMMENT '明细，空 | JSON 字符串',
    use_custom        TINYINT         NOT NULL DEFAULT 0 COMMENT '是否使用自定义数据',
    custom_data_str   MEDIUMTEXT COMMENT '自定义补贴数据',
    extras_info       MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    is_pretty         TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为标准情况',
    is_verified       TINYINT         NOT NULL DEFAULT 0 COMMENT '是否已核验',
    version           INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    allowance_case    INT             NOT NULL DEFAULT 0 COMMENT 'HLY_AllowanceCase',
    without_allowance TINYINT         NOT NULL DEFAULT 0 COMMENT '不发放出差补贴',
    pay_amount        DOUBLE          NOT NULL DEFAULT 0 COMMENT '支付金额',
    batch_no          CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '批次号',
    snap_hash         CHAR(32)        NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'uid + days_count + amount MD5',
    is_locked         TINYINT         NOT NULL DEFAULT 0 COMMENT '是否锁定',
    snap_month        CHAR(7)         NOT NULL COLLATE ascii_bin COMMENT '归档月份 yyyy-MM',
    is_primary        TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为最新主版本',
    create_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (uid, snap_month),
#     UNIQUE (uid),
#     UNIQUE (business_code, target_month, applicant_oid),
    INDEX (target_month),
    INDEX (applicant_oid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_snapshot_log;
CREATE TABLE IF NOT EXISTS hly_snapshot_log
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    snap_month  CHAR(7)         NOT NULL COLLATE ascii_bin COMMENT '快照月份 yyyy-MM',
    version     INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    remarks     VARCHAR(255)    NOT NULL DEFAULT '' COMMENT '备注',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (snap_month)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_invoice;
CREATE TABLE IF NOT EXISTS hly_invoice
(
    _rid               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    invoice_oid        CHAR(36)        NULL COLLATE ascii_bin,
    expense_type_code  VARCHAR(32)     NOT NULL COLLATE ascii_bin,
    expense_type_name  TEXT            NULL,
    invoice_status     VARCHAR(16)     NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'HLY_InvoiceStatus',
    reimbursement_oid  CHAR(36)        NULL COLLATE ascii_bin,
    reimbursement_name TEXT            NULL,
    amount             DOUBLE          NOT NULL COMMENT '总金额',
    created_date       TIMESTAMP       NULL,
    last_modified_date TIMESTAMP       NULL,
    extras_info        MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    reload_time        TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (invoice_oid),
    INDEX (invoice_status),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS dummy_travel;
CREATE TABLE IF NOT EXISTS dummy_travel
(
    hly_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    business_code  VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    special_key    CHAR(32)        NULL COLLATE ascii_bin COMMENT 'Special Hash',
    applicant_oid  CHAR(36)        NULL COLLATE ascii_bin,
    applicant_name TEXT            NULL,
    submitted_by   CHAR(36)        NULL COLLATE ascii_bin,
    title          TEXT            NULL,
    start_time     TIMESTAMP       NULL COMMENT '开始时间',
    end_time       TIMESTAMP       NULL COMMENT '结束时间',
    version        INT             NOT NULL DEFAULT 0 COMMENT '版本号',
    travel_status  INT             NULL COMMENT 'HLY_TravelStatus',
    remarks        VARCHAR(255)    NOT NULL DEFAULT '' COMMENT '备注',
    create_time    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (business_code),
    UNIQUE (special_key),
    INDEX (start_time),
    INDEX (end_time),
    INDEX (travel_status)
) ENGINE = InnoDB
  AUTO_INCREMENT = 100000001
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS dummy_ticket;
CREATE TABLE IF NOT EXISTS dummy_ticket
(
    order_id      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id     CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'UUID',
    order_type    VARCHAR(20)     NOT NULL COLLATE ascii_bin COMMENT 'HLY_OrderType',
    user_oid      CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id   VARCHAR(64)     NULL COLLATE ascii_bin,
    user_name     VARCHAR(64)     NOT NULL DEFAULT '',
    base_city     VARCHAR(16)     NOT NULL DEFAULT '',
    traffic_code  VARCHAR(16)     NOT NULL DEFAULT '',
    from_time     TIMESTAMP       NULL COMMENT '开始时间',
    to_time       TIMESTAMP       NULL COMMENT '结束时间',
    from_city     VARCHAR(16)     NOT NULL,
    to_city       VARCHAR(16)     NOT NULL,
    business_code VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin,
    is_valid      TINYINT         NOT NULL DEFAULT 0 COMMENT '是否有效',
    remarks       VARCHAR(255)    NOT NULL DEFAULT '' COMMENT '备注',
    create_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (ticket_id),
    INDEX (user_oid),
    INDEX (business_code),
    INDEX (from_time),
    INDEX (is_valid)
) ENGINE = InnoDB
  AUTO_INCREMENT = 100000001
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_traffic_ticket;
CREATE TABLE IF NOT EXISTS hly_traffic_ticket
(
    _rid              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id         CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'order_type + order_id + order_oid + user_oid(user_name) + traffic_code MD5',
    order_type        VARCHAR(20)     NOT NULL COLLATE ascii_bin COMMENT 'HLY_OrderType',
    order_id          BIGINT UNSIGNED NOT NULL,
    order_oid         CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    user_oid          CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id       VARCHAR(64)     NULL COLLATE ascii_bin,
    user_name         VARCHAR(64)     NOT NULL DEFAULT '',
    base_city         VARCHAR(16)     NOT NULL DEFAULT '',
    traffic_code      VARCHAR(16)     NOT NULL DEFAULT '',
    from_time         TIMESTAMP       NULL COMMENT '开始时间',
    to_time           TIMESTAMP       NULL COMMENT '结束时间',
    from_city         VARCHAR(16)     NOT NULL,
    to_city           VARCHAR(16)     NOT NULL,
    journey_no        VARCHAR(20)     NOT NULL DEFAULT '',
    business_code     VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin,
    hly_code          VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '汇联易 Business Code',
    custom_code       VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '手动绑定 Business Code',
    is_valid          TINYINT         NOT NULL DEFAULT 0 COMMENT '是否有效',
    ctrip_valid       TINYINT         NOT NULL DEFAULT 0 COMMENT 'CTrip 订单是否有效',
    ctrip_status      VARCHAR(20)     NULL,
    custom_valid      TINYINT         NULL COMMENT '自定义有效状态',
    use_for_allowance TINYINT         NOT NULL DEFAULT 0 COMMENT '是否参与补贴计算',
    in_closed_loop    TINYINT         NOT NULL DEFAULT 0 COMMENT '位于闭环行程中',
    is_editable       TINYINT         NOT NULL DEFAULT 0 COMMENT '是否可被编辑',
    is_dummy          TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为虚拟票据',
    remarks           VARCHAR(255)    NOT NULL DEFAULT '' COMMENT '备注',
    create_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (ticket_id),
    INDEX (user_oid),
    INDEX (business_code),
    INDEX (from_time),
    INDEX (is_valid),
    INDEX (is_dummy),
    INDEX (use_for_allowance)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_order_flight;
CREATE TABLE IF NOT EXISTS hly_order_flight
(
    hly_id                BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    user_oid              CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id           VARCHAR(64)     NULL COLLATE ascii_bin,
    applicant_name        TEXT            NULL,
    journey_no            VARCHAR(20)     NOT NULL DEFAULT '',
    business_code         VARCHAR(20)     NULL COLLATE ascii_bin,
    company_oid           CHAR(36)        NULL COLLATE ascii_bin,
    order_type            VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    pay_type              VARCHAR(20)     NOT NULL DEFAULT '',
    order_status          VARCHAR(20)     NOT NULL,
    ctrip_status          VARCHAR(20)     NULL,
    audit_status          VARCHAR(20)     NULL,
    created_date          TIMESTAMP       NULL,
    last_modified_date    TIMESTAMP       NULL,
    extras_info           MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    start_time            TIMESTAMP       NULL COMMENT '开始时间',
    end_time              TIMESTAMP       NULL COMMENT '结束时间',
    use_for_allowance     TINYINT         NOT NULL DEFAULT 0 COMMENT '是否参与补贴计算',
    ticket_user_oids_str  TEXT COLLATE ascii_bin,
    ticket_user_names_str TEXT            NULL,
    reload_time           TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX (user_oid),
    INDEX (business_code),
    INDEX (journey_no),
    INDEX (business_code),
    INDEX (start_time),
    INDEX (end_time),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_order_train;
CREATE TABLE IF NOT EXISTS hly_order_train
(
    hly_id                BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    user_oid              CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id           VARCHAR(64)     NULL COLLATE ascii_bin,
    applicant_name        TEXT            NULL,
    journey_no            VARCHAR(20)     NOT NULL DEFAULT '',
    business_code         VARCHAR(20)     NULL COLLATE ascii_bin,
    company_oid           CHAR(36)        NULL COLLATE ascii_bin,
    order_type            VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    pay_type              VARCHAR(20)     NOT NULL DEFAULT '',
    order_status          VARCHAR(20)     NOT NULL,
    ctrip_status          VARCHAR(20)     NULL,
    audit_status          VARCHAR(20)     NULL,
    created_date          TIMESTAMP       NULL,
    last_modified_date    TIMESTAMP       NULL,
    extras_info           MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    start_time            TIMESTAMP       NULL COMMENT '开始时间',
    end_time              TIMESTAMP       NULL COMMENT '结束时间',
    use_for_allowance     TINYINT         NOT NULL DEFAULT 0 COMMENT '是否参与补贴计算',
    ticket_user_oids_str  TEXT COLLATE ascii_bin,
    ticket_user_names_str TEXT            NULL,
    reload_time           TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX (user_oid),
    INDEX (business_code),
    INDEX (journey_no),
    INDEX (business_code),
    INDEX (start_time),
    INDEX (end_time),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_order_hotel;
CREATE TABLE IF NOT EXISTS hly_order_hotel
(
    hly_id                BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    user_oid              CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id           VARCHAR(64)     NULL COLLATE ascii_bin,
    applicant_name        TEXT            NULL,
    journey_no            VARCHAR(20)     NOT NULL DEFAULT '',
    business_code         VARCHAR(20)     NULL COLLATE ascii_bin,
    company_oid           CHAR(36)        NULL COLLATE ascii_bin,
    order_type            VARCHAR(20)     NOT NULL COLLATE ascii_bin,
    pay_type              VARCHAR(20)     NOT NULL DEFAULT '',
    order_status          VARCHAR(20)     NOT NULL,
    ctrip_status          VARCHAR(20)     NULL,
    audit_status          VARCHAR(20)     NULL,
    created_date          TIMESTAMP       NULL,
    last_modified_date    TIMESTAMP       NULL,
    extras_info           MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    start_time            TIMESTAMP       NULL COMMENT '开始时间',
    end_time              TIMESTAMP       NULL COMMENT '结束时间',
    use_for_allowance     TINYINT         NOT NULL DEFAULT 0 COMMENT '是否参与补贴计算',
    ticket_user_oids_str  TEXT COLLATE ascii_bin,
    ticket_user_names_str TEXT            NULL,
    reload_time           TIMESTAMP       NOT NULL DEFAULT '2000-01-01 00:00:00',
    create_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX (user_oid),
    INDEX (business_code),
    INDEX (journey_no),
    INDEX (business_code),
    INDEX (start_time),
    INDEX (end_time),
    INDEX (last_modified_date),
    INDEX (reload_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_staff;
CREATE TABLE IF NOT EXISTS hly_staff
(
    _rid                 BIGINT UNSIGNED           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_oid             CHAR(36)                  NOT NULL COLLATE ascii_bin,
    employee_id          VARCHAR(64)               NOT NULL COLLATE ascii_bin,
    staff_role           ENUM ('Normal','Manager') NOT NULL DEFAULT 'Normal' COMMENT '员工类型',
    company_code         VARCHAR(20)               NULL COLLATE ascii_bin,
    full_name            VARCHAR(64)               NOT NULL DEFAULT '',
    email                VARCHAR(128)              NULL COLLATE ascii_bin,
    base_city            VARCHAR(64)               NOT NULL DEFAULT '',
    in_force_spend_group TINYINT                   NOT NULL DEFAULT 0,
    in_none_spend_group  TINYINT                   NOT NULL DEFAULT 0,
    is_special_allowance TINYINT                   NOT NULL DEFAULT 0,
    without_allowance    TINYINT                   NOT NULL DEFAULT 0 COMMENT '不发放出差补贴',
    department_oid       CHAR(36)                  NULL COLLATE ascii_bin,
    department_path      TEXT                      NULL,
    staff_status         INT                       NOT NULL COMMENT 'HLY_StaffStatus',
    entry_date           TIMESTAMP                 NULL,
    leaving_date         TIMESTAMP                 NULL,
    group_oids_str       TEXT COLLATE ascii_bin,
    group_codes_str      TEXT COLLATE ascii_bin,
    group_names_str      TEXT,
    extras_info          MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time          TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time          TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (user_oid),
    UNIQUE (employee_id),
    INDEX (email),
    INDEX (staff_role),
    INDEX (staff_status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_staff_group;
CREATE TABLE IF NOT EXISTS hly_staff_group
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_oid   CHAR(36)        NOT NULL COLLATE ascii_bin,
    group_code  VARCHAR(32)     NULL COLLATE ascii_bin,
    group_name  VARCHAR(64)     NOT NULL DEFAULT '',
    is_enabled  TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为标准情况',
    extras_info MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_oid),
    INDEX (is_enabled)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS hly_staff_group_member;
CREATE TABLE IF NOT EXISTS hly_staff_group_member
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_oid   CHAR(36)        NOT NULL COLLATE ascii_bin,
    user_oid    CHAR(36)        NOT NULL COLLATE ascii_bin,
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_oid, user_oid)
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

# DROP TABLE IF EXISTS hly_config;
CREATE TABLE IF NOT EXISTS hly_config
(
    _rid            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    config_key      CHAR(36)        NOT NULL COLLATE ascii_bin,
    config_data_str MEDIUMTEXT COMMENT 'JSON 字符串',
    create_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (config_key)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

# DROP TABLE IF EXISTS hly_allowance_rule;
CREATE TABLE IF NOT EXISTS hly_allowance_rule
(
    _rid            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uid             CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'UUID',
    role_match_type VARCHAR(20)     NOT NULL COLLATE ascii_bin DEFAULT '',
    role_list_str   TEXT,
    city_match_type VARCHAR(20)     NOT NULL COLLATE ascii_bin DEFAULT '',
    city_list_str   TEXT,
    amount          DOUBLE          NOT NULL COMMENT '金额',
    create_time     TIMESTAMP       NOT NULL                   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     TIMESTAMP       NOT NULL                   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (uid)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS ctrip_order;
CREATE TABLE IF NOT EXISTS ctrip_order
(
    order_id      BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    order_type    VARCHAR(20)     NULL COLLATE ascii_bin COMMENT 'CTrip_OrderType',
    employee_id   VARCHAR(64)     NULL COLLATE ascii_bin,
    user_name     VARCHAR(64)     NOT NULL DEFAULT '',
    order_status  VARCHAR(20)     NULL,
    change_status VARCHAR(20)     NULL,
    journey_no    VARCHAR(20)     NOT NULL DEFAULT '',
    business_code VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin,
    created_date  TIMESTAMP       NULL,
    extras_info   MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    is_locked     TINYINT         NOT NULL DEFAULT 0 COMMENT '是否锁定',
    create_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS ctrip_ticket;
CREATE TABLE IF NOT EXISTS ctrip_ticket
(
    _rid          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id     CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'order_type + order_id + info_id + user_oid(user_name) + traffic_code MD5',
    order_type    VARCHAR(20)     NOT NULL COLLATE ascii_bin COMMENT 'HLY_OrderType',
    order_id      BIGINT UNSIGNED NOT NULL,
    info_id       VARCHAR(36)     NOT NULL DEFAULT '' COLLATE ascii_bin,
    employee_id   VARCHAR(64)     NULL COLLATE ascii_bin,
    user_name     VARCHAR(64)     NOT NULL DEFAULT '',
    user_oid      CHAR(36)        NOT NULL DEFAULT '' COLLATE ascii_bin,
    base_city     VARCHAR(16)     NOT NULL DEFAULT '',
    traffic_code  VARCHAR(16)     NOT NULL DEFAULT '',
    from_time     TIMESTAMP       NULL COMMENT '开始时间',
    to_time       TIMESTAMP       NULL COMMENT '结束时间',
    from_city     VARCHAR(16)     NOT NULL,
    to_city       VARCHAR(16)     NOT NULL,
    journey_no    VARCHAR(20)     NOT NULL DEFAULT '',
    business_code VARCHAR(20)     NOT NULL DEFAULT '' COLLATE ascii_bin,
    ctrip_status  VARCHAR(20)     NULL,
    deprecated_id CHAR(32)        NULL COLLATE ascii_bin,
    create_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (ticket_id),
    INDEX (business_code),
    INDEX (from_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
