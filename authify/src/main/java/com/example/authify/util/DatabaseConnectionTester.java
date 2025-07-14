package com.example.authify.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseConnectionTester implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionTester.class);

    private final DataSource dataSource;

    public DatabaseConnectionTester(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        try (Connection connection = dataSource.getConnection()) {
            if (connection != null && !connection.isClosed()) {
                logger.info("[util][DatabaseConnectionTester] Conexión a la base de datos exitosa.");
            } else {
                logger.warn("[util][DatabaseConnectionTester] La conexión a la base de datos está cerrada o es nula.");
            }
        } catch (Exception e) {
            logger.error("[util][DatabaseConnectionTester] Error al conectar a la base de datos", e);
        }
    }
}
