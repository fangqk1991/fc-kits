# CREATE DATABASE `event_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS event_log;
DROP TABLE IF EXISTS stat_event;

CREATE TABLE IF NOT EXISTS stat_event
(
    _rid        BIGINT UNSIGNED    NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id    CHAR(32)           NOT NULL COLLATE ascii_bin COMMENT '事件唯一 ID',
    event_type  VARCHAR(64)        NOT NULL DEFAULT 'Hyperlink' COMMENT '事件类型',
    content     TEXT COMMENT '事件内容',
    create_time TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE (event_id),
    INDEX (event_type)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS event_log
(
    _rid        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id    CHAR(32)        NOT NULL COLLATE ascii_bin COMMENT 'event_id，SQL 外键 -> stat_event.event_id',
    FOREIGN KEY (event_id) REFERENCES stat_event (event_id) ON DELETE RESTRICT,
    visitor     VARCHAR(127)    NOT NULL COLLATE ascii_bin DEFAULT '' COMMENT '访问者',
    create_time TIMESTAMP       NOT NULL                   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX (visitor),
    INDEX (create_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
