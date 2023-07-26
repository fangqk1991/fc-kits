DROP TABLE IF EXISTS oss_resource;
DROP TABLE IF EXISTS user_resource_task;
DROP TABLE IF EXISTS resource_task;

CREATE TABLE IF NOT EXISTS oss_resource
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resource_id CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '资源唯一 ID',
    provider    VARCHAR(16)     NOT NULL DEFAULT 'Aliyun' COMMENT '服务商',
    bucket_name VARCHAR(127)    NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'Bucket Name',
    oss_key     TEXT COMMENT 'OSS Key',
    mime_type   VARCHAR(127)    NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'MIME Type',
    size        BIGINT          NOT NULL DEFAULT 0 COMMENT '文件大小(B)',
    oss_status  ENUM ('Pending', 'Uploading', 'Success', 'Fail', 'Deleted') COMMENT '文件状态',
    uploader    VARCHAR(127)    NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '上传者',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间: ISO8601 字符串',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间: ISO8601 字符串',
    UNIQUE (resource_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS resource_task
(
    _rid           BIGINT UNSIGNED                                   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    task_key       CHAR(32)                                          NOT NULL COLLATE ascii_bin COMMENT '任务 Key',
    resource_id    CHAR(32)                                          NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT '资源唯一 ID',
    provider       VARCHAR(16)                                       NOT NULL DEFAULT 'Aliyun' COMMENT '服务商',
    bucket_name    VARCHAR(127)                                      NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'Bucket Name',
    oss_key        TEXT COMMENT 'OSS Key',
    mime_type      VARCHAR(127)                                      NOT NULL DEFAULT '' COLLATE ascii_bin COMMENT 'MIME Type',
    size           BIGINT                                            NOT NULL DEFAULT 0 COMMENT '文件大小(B)',
    task_type      VARCHAR(127)                                      NOT NULL DEFAULT '' COMMENT '任务类型',
    file_name      VARCHAR(127)                                      NOT NULL DEFAULT '' COMMENT '文件名',
    current        BIGINT                                            NOT NULL DEFAULT 0 COMMENT '当前已完成',
    total          BIGINT                                            NOT NULL DEFAULT 0 COMMENT '总数',
    task_status    ENUM ('Pending', 'Processing', 'Success', 'Fail') NOT NULL DEFAULT 'Pending' COMMENT '任务状态，ResourceTaskStatus',
    error_message  TEXT COMMENT '错误信息',
    raw_params_str TEXT COMMENT '任务原始参数',
    create_time    TIMESTAMP                                         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time    TIMESTAMP                                         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (task_key)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS user_resource_task
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    task_key    CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT '任务 Key',
    FOREIGN KEY (task_key) REFERENCES resource_task (task_key) ON DELETE RESTRICT,
    user_email  VARCHAR(127)    NOT NULL COLLATE ascii_bin COMMENT '用户邮箱',
    create_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (task_key, user_email),
    INDEX (user_email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
