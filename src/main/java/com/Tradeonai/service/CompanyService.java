package com.Tradeonai.service;

import com.Tradeonai.model.Company;
import com.Tradeonai.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EmailService emailService;

    private static final String UPLOAD_DIR = "uploads/";

    @Transactional
    public void registerCompany(Company company,  MultipartFile sqlFile) throws IOException {
        String loginId = "TRAD-" + UUID.randomUUID().toString().substring(0, 8);
        company.setLoginId(loginId);

        String sqlFilePath = saveFile(sqlFile, "sql_files");

        if (sqlFilePath != null) {
            company.setSqlFilePath(sqlFilePath);

            String tableName = getQuarterlyResultsTableName(company.getName());
            createDefaultTableIfNotExists(tableName);
            executeSqlFile(sqlFilePath, tableName);
        }

        companyRepository.save(company);
        emailService.sendLoginIdEmail(company.getEmail(), company.getLoginId(), company.getName());
    }

    public Company getCompanyByName(String companyName) {
        return companyRepository.findByName(companyName);
    }


    private String getQuarterlyResultsTableName(String companyName) {
        return "quarterly_results_" + companyName.toLowerCase().replaceAll("\\s+", "_");
    }

    private void createDefaultTableIfNotExists(String tableName) {
        String createTableQuery = "CREATE TABLE IF NOT EXISTS " + tableName + " ("
                + "id BIGINT AUTO_INCREMENT PRIMARY KEY, "
                + "category VARCHAR(255), "
                + "qoq VARCHAR(20), "
                + "yoy VARCHAR(20), "
                + "dec_2024 DOUBLE, sep_2024 DOUBLE, jun_2024 DOUBLE, mar_2024 DOUBLE, "
                + "dec_2023 DOUBLE, sep_2023 DOUBLE, jun_2023 DOUBLE, mar_2023 DOUBLE, "
                + "dec_2022 DOUBLE, "
                + "market_cap DOUBLE, "
                + "position INT "
                + ")";
        jdbcTemplate.execute(createTableQuery);
    }

    private void executeSqlFile(String sqlFilePath, String tableName) {
        try (BufferedReader reader = new BufferedReader(new FileReader(sqlFilePath));
             Connection connection = jdbcTemplate.getDataSource().getConnection();
             Statement statement = connection.createStatement()) {

            connection.setAutoCommit(false);

            StringBuilder fileContent = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                fileContent.append(line.trim()).append("\n");
            }

            String updatedSql = fileContent.toString()
                    .replaceFirst("(?i)CREATE TABLE IF NOT EXISTS\\s+[a-zA-Z0-9_]+", "CREATE TABLE IF NOT EXISTS " + tableName + "")
                    .replaceFirst("(?i)INSERT INTO\\s+[a-zA-Z0-9_]+", "INSERT INTO " + tableName + "");

            String[] queries = updatedSql.split(";");

            for (String query : queries) {
                if (!query.trim().isEmpty()) {
                    statement.addBatch(query.trim() + ";");
                }
            }

            statement.executeBatch();
            connection.commit();

            System.out.println("\u2705 SQL file executed and data inserted into: " + tableName);

        } catch (Exception e) {
            System.err.println("\u274C Error executing SQL file: " + e.getMessage());
        }
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyByEmail(String email) {
        return companyRepository.findByEmail(email);
    }

    public List<Map<String, Object>> getQuarterlyResults(String companyName) {
        String tableName = getQuarterlyResultsTableName(companyName);
        String query = "SELECT * FROM " + tableName + "";
        return jdbcTemplate.queryForList(query);
    }

    public Map<String, Map<String, String>> getAggregatedQuarterlyResults(String companyName) {
        String tableName = getQuarterlyResultsTableName(companyName);

        String query = "SELECT category, " +
                "SUM(qoq) AS total_qoq, SUM(yoy) AS total_yoy, " +
                "SUM(dec_2024) AS total_dec_2024, SUM(sep_2024) AS total_sep_2024, " +
                "SUM(jun_2024) AS total_jun_2024, SUM(mar_2024) AS total_mar_2024, " +
                "SUM(dec_2023) AS total_dec_2023, SUM(sep_2023) AS total_sep_2023, " +
                "SUM(jun_2023) AS total_jun_2023, SUM(mar_2023) AS total_mar_2023, " +
                "SUM(dec_2022) AS total_dec_2022, " +
                "SUM(market_cap) AS total_market_cap, " +
                "SUM(position) AS position " +
                "FROM " + tableName + " GROUP BY category";

        List<Map<String, Object>> results = jdbcTemplate.queryForList(query);

        Map<String, Map<String, String>> aggregatedResults = new HashMap<>();
        for (Map<String, Object> row : results) {
            String category = (String) row.get("category");
            Map<String, String> totals = new HashMap<>();

            row.forEach((key, value) -> {
                if (!key.equals("category") && value != null) {
                    if (key.equals("total_qoq") || key.equals("total_yoy")) {
                        totals.put(key, formatPercentage((Double) value));
                    } else if (key.equals("position")) {
                        totals.put(key, String.valueOf(value));  // Position is an integer, so store as a string
                    } else {
                        totals.put(key, formatNumber((Double) value));
                    }
                }
            });

            aggregatedResults.put(category, totals);
        }

        return aggregatedResults;
    }

    private String formatNumber(double value) {
        if (value >= 1_000_000_000) {
            return String.format("%.2fB", value / 1_000_000_000);
        } else if (value >= 1_000_000) {
            return String.format("%.2fM", value / 1_000_000);
        } else if (value >= 1_000) {
            return String.format("%.2fK", value / 1_000);
        } else {
            return String.format("%.2f", value);
        }
    }

    private String formatPercentage(double value) {
        return String.format("%.2f%%", value);
    }

    private String  saveFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String directoryPath = UPLOAD_DIR + folder;
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(directoryPath, fileName);
        Files.write(filePath, file.getBytes());

        return filePath.toString().replace("\\", "/");
    }
}