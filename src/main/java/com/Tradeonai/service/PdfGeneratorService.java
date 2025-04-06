package com.Tradeonai.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.text.DateFormatSymbols;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {

    private final JdbcTemplate jdbcTemplate;

    public PdfGeneratorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public byte[] generateStatementPdf(String companyName, String logoPath, String gstNumber, String contact, String email, String dueDate, String selectedMonth) {
        List<Map<String, Object>> results;
        try {
            results = getQuarterlyResults(companyName, selectedMonth);
            System.out.println("Fetched results: " + results);
        } catch (Exception e) {
            System.err.println("\u274C Database error: " + e.getMessage());
            return null;
        }

        if (results.isEmpty()) {
            System.err.println("\u274C No results found for " + companyName);
            return null;
        }

        String year = selectedMonth.split("_")[1];

        List<String> months = getSelectedQuarter(selectedMonth);
        results = processMissingMonths(results, months);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            if (logoPath != null && !logoPath.isEmpty()) {
                File logoFile = new File(logoPath);
                if (logoFile.exists()) {
                    Image logo = Image.getInstance(logoPath);
                    logo.scaleToFit(100, 50);
                    logo.setAlignment(Element.ALIGN_LEFT);
                    document.add(logo);
                }
            }

            Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Paragraph companyDetails = new Paragraph(
                    companyName + "\nGST: " + gstNumber + "\nContact: " + contact + "\nEmail: " + email + "\nDue Date: " + dueDate, boldFont);
            companyDetails.setAlignment(Element.ALIGN_RIGHT);
            document.add(companyDetails);
            document.add(new Paragraph("\n"));

            double totalRevenue = 0;

            for (String month : months) {
                document.add(new Paragraph(month + " " + year, boldFont));

                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.addCell(new PdfPCell(new Phrase("Category", boldFont)));
                table.addCell(new PdfPCell(new Phrase("Values", boldFont)));

                for (Map.Entry<String, Double> entry : summarizeResultsByMonth(results, month).entrySet()) {
                    if (Arrays.asList("Net Profit", "Operating Income", "Revenue").contains(entry.getKey())) {
                        table.addCell(entry.getKey());
                        table.addCell(String.format("%.2f", entry.getValue()));
                        totalRevenue += entry.getValue();
                    }
                }

                document.add(table);
                document.add(new Paragraph("\n"));
            }

            // Tax calculations
            double cgst = totalRevenue * 0.05;
            double sgst = totalRevenue * 0.05;
            double totalTax = cgst + sgst;
            double totalAmount = totalRevenue + totalTax;

            document.add(new Paragraph("Total Amount: " + String.format("%.2f", totalRevenue), boldFont));
            document.add(new Paragraph("CGST (5%): " + String.format("%.2f", cgst), boldFont));
            document.add(new Paragraph("SGST (5%): " + String.format("%.2f", sgst), boldFont));
            document.add(new Paragraph("Total Tax: " + String.format("%.2f", totalTax), boldFont));
            document.add(new Paragraph("Total Amount Including All Tax: " + String.format("%.2f", totalAmount), boldFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            System.err.println("\u274C PDF Generation error: " + e.getMessage());
            return null;
        }
    }

    private List<String> getSelectedQuarter(String selectedMonth) {
        List<String> monthsInQuarter = new ArrayList<>();
        int baseMonth = getMonthIndex(selectedMonth);

        if (baseMonth == -1) return monthsInQuarter;

        for (int i = 2; i >= 0; i--) {
            int monthIndex = baseMonth - i;
            if (monthIndex < 0) {
                monthIndex += 12;
            }
            monthsInQuarter.add(getMonthName(monthIndex));
        }

        return monthsInQuarter;
    }

    private int getMonthIndex(String selectedMonth) {
        String[] parts = selectedMonth.split("_");
        String monthPart = parts[0].toLowerCase();

        switch (monthPart) {
            case "mar": return Calendar.MARCH;
            case "jun": return Calendar.JUNE;
            case "sep": return Calendar.SEPTEMBER;
            case "dec": return Calendar.DECEMBER;
            default: return -1;
        }
    }

    private String getMonthName(int monthIndex) {
        return new DateFormatSymbols().getMonths()[monthIndex];
    }

    private List<Map<String, Object>> processMissingMonths(List<Map<String, Object>> results, List<String> months) {
        Map<String, List<Double>> categoryRevenueMap = new HashMap<>();

        for (Map<String, Object> row : results) {
            String category = row.get("category").toString();
            double revenue = row.get("revenue") != null ? ((Number) row.get("revenue")).doubleValue() : 0;
            categoryRevenueMap.computeIfAbsent(category, k -> new ArrayList<>()).add(revenue);
        }

        List<Map<String, Object>> processedResults = new ArrayList<>();
        for (String category : categoryRevenueMap.keySet()) {
            List<Double> revenues = categoryRevenueMap.get(category);
            int totalSize = revenues.size();
            int sizePerMonth = Math.max(1, totalSize / months.size());

            for (int i = 0; i < months.size(); i++) {
                int start = i * sizePerMonth;
                int end = Math.min(start + sizePerMonth, totalSize);

                double sum = revenues.subList(start, end).stream().mapToDouble(Double::doubleValue).sum();

                Map<String, Object> newEntry = new HashMap<>();
                newEntry.put("category", category);
                newEntry.put("month", months.get(i));
                newEntry.put("revenue", sum);
                processedResults.add(newEntry);
            }
        }

        return processedResults;
    }

    private Map<String, Double> summarizeResultsByMonth(List<Map<String, Object>> results, String month) {
        return results.stream()
                .filter(row -> row.get("month").equals(month))
                .filter(row -> Arrays.asList("Net Profit", "Operating Income", "Revenue").contains(row.get("category")))
                .collect(Collectors.groupingBy(
                        row -> row.get("category").toString(),
                        Collectors.summingDouble(row -> (double) row.get("revenue"))
                ));
    }

    public List<Map<String, Object>> getQuarterlyResults(String companyName, String monthYear) {
        String tableName = "quarterly_results_" + companyName.toLowerCase().replaceAll("\\s+", "_");
        String columnName = monthYear.toLowerCase(); // Example: dec_2023, mar_2024, etc.

        String checkTableQuery = "SHOW TABLES LIKE ?";
        if (jdbcTemplate.queryForList(checkTableQuery, tableName).isEmpty()) {
            System.err.println("\u274C Table does not exist: " + tableName);
            return Collections.emptyList();
        }

        String checkColumnQuery = "SHOW COLUMNS FROM " + tableName + " LIKE ?";
        if (jdbcTemplate.queryForList(checkColumnQuery, columnName).isEmpty()) {
            System.err.println("\u274C Column does not exist: " + columnName);
            return Collections.emptyList();
        }

        String query = "SELECT category, '" + columnName + "' AS month, " + columnName + " AS revenue FROM " + tableName
                + " WHERE category IN ('Net Profit', 'Operating Income', 'Revenue')";

        return jdbcTemplate.queryForList(query);
    }
}
