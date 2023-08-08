# CREATE DATABASE `demo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

DROP TABLE IF EXISTS ctrip_order;
CREATE TABLE IF NOT EXISTS ctrip_order
(
    order_id     BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    order_type   VARCHAR(20)     NOT NULL COLLATE ascii_bin COMMENT 'CTrip_OrderType',
    employee_id  VARCHAR(64)     NULL COLLATE ascii_bin,
    user_name    VARCHAR(64)     NOT NULL DEFAULT '',
    order_status VARCHAR(20)     NOT NULL,
    journey_no   VARCHAR(20)     NOT NULL DEFAULT '',
    extras_info  MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
