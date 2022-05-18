### 常用命令

| 命令功能                   | 执行命令                                       |
| -------------------------- | ---------------------------------------------- |
| 重启配置并启动 gitlab 服务 | sudo gitlab-ctl reconfigure                    |
| 启动所有                   | gitlab sudo gitlab-ctl start                   |
| 重新启动 GitLab            | sudo gitlab-ctl restart                        |
| 停止所有                   | gitlab sudo gitlab-ctl stop                    |
| 查看服务状态               | sudo gitlab-ctl status                         |
| 查看 Gitlab 日志           | sudo gitlab-ctl tail                           |
| 修改默认的配置文件         | sudo vim /etc/gitlab/gitlab.rb                 |
| 检查 gitlab                | gitlab-rake gitlab:check SANITIZE=true --trace |
