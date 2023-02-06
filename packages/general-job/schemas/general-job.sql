# CREATE DATABASE `general_data` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE general_data;

CREATE TABLE IF NOT EXISTS common_job
(
    _rid            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_id          CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '任务 ID，具备唯一性',
    app             VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '应用',
    queue           VARCHAR(63)     NOT NULL DEFAULT '' COMMENT '所处队列',
    task_name       VARCHAR(63)     NOT NULL DEFAULT '' COMMENT '任务名',
    object_id       VARCHAR(63)     NOT NULL DEFAULT '' COMMENT '对象主键 ID',
    params_str      TEXT COMMENT '相关参数',
    task_state      VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '任务状态',
    pending_elapsed BIGINT          NOT NULL DEFAULT 0 COMMENT '任务等待耗时，单位：毫秒',
    perform_elapsed BIGINT          NOT NULL DEFAULT 0 COMMENT '任务执行耗时，单位：毫秒',
    error_message   TEXT COMMENT '错误信息',
    create_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (job_id),
    INDEX (app),
    INDEX (queue),
    INDEX (task_name),
    INDEX (object_id),
    INDEX (task_state),
    INDEX (pending_elapsed),
    INDEX (perform_elapsed),
    INDEX (create_time),
    INDEX (update_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;
