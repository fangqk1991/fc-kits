# CREATE DATABASE `general_data` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE general_data;

DROP TABLE IF EXISTS group_member;
DROP TABLE IF EXISTS group_permission;
DROP TABLE IF EXISTS common_group;

CREATE TABLE IF NOT EXISTS common_group
(
    _rid        BIGINT UNSIGNED               NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id    CHAR(32) COLLATE ascii_bin    NOT NULL COMMENT '组 ID，具备唯一性',
    app         VARCHAR(31) COLLATE ascii_bin NOT NULL DEFAULT '' COMMENT '应用标识符',
    name        VARCHAR(127)                  NOT NULL DEFAULT '' COMMENT '组名',
    space       VARCHAR(127)                  NOT NULL DEFAULT '' COMMENT '组所处的空间',
    obj_key     VARCHAR(63)                   NOT NULL DEFAULT '' COMMENT '标识键',
    group_level VARCHAR(127)                  NOT NULL COMMENT '字段类型: 枚举值见 GroupLevel 定义',
    remarks     VARCHAR(255)                  NOT NULL DEFAULT '' COMMENT '备注',
    version     INT                           NOT NULL DEFAULT 0 COMMENT '版本号',
    create_time TIMESTAMP                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP                     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id),
    INDEX (space, obj_key),
    INDEX (app),
    INDEX (space)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS group_member
(
    _rid        BIGINT UNSIGNED                NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id    CHAR(32) COLLATE ascii_bin     NOT NULL COMMENT '组 ID，SQL 外键 -> common_group.group_id',
    FOREIGN KEY (group_id) REFERENCES common_group (group_id) ON DELETE RESTRICT,
    member      VARCHAR(127) COLLATE ascii_bin NOT NULL COMMENT '用户唯一标识；(group_id, member) 具备唯一性',
    is_admin    TINYINT                        NOT NULL DEFAULT 0 COMMENT '是否为管理员',
    extras_info MEDIUMTEXT COMMENT '附加信息，空 | JSON 字符串',
    create_time TIMESTAMP                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP                      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id, member),
    INDEX (member)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS group_permission
(
    _rid        BIGINT UNSIGNED                NOT NULL AUTO_INCREMENT PRIMARY KEY,
    group_id    CHAR(32) COLLATE ascii_bin     NOT NULL COMMENT '组 ID，SQL 外键 -> common_group.group_id',
    FOREIGN KEY (group_id) REFERENCES common_group (group_id) ON DELETE RESTRICT,
    scope       VARCHAR(63) COLLATE ascii_bin  NOT NULL COMMENT '范围描述项 | *',
    permission  VARCHAR(127) COLLATE ascii_bin NOT NULL DEFAULT '' COMMENT '权限描述项 GeneralPermission | *',
    create_time TIMESTAMP                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP                      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE (group_id, scope, permission),
    INDEX (scope),
    INDEX (permission)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE utf8mb4_general_ci;
