# Install
- `mvn sql:execute`

# Execute
- `mvn spring-boot:run`
- Go to http://127.0.0.1:8888/tasks-service/dashboard/

# IMPORTANT

In the application URL, `localhost` cannot be used. `127.0.0.1` must be used instead. This is a
restriction imposed by Spring Authorization Server.

# FEATURES

- A warning is shown at startup regarding HikariCP. More information:
    - https://github.com/spring-projects/spring-boot/issues/35599
    - https://github.com/brettwooldridge/HikariCP/issues/2075
