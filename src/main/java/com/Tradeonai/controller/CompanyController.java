package com.Tradeonai.controller;

import com.Tradeonai.model.Company;
import com.Tradeonai.service.CompanyService;
import com.Tradeonai.service.PdfGeneratorService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final PdfGeneratorService pdfGeneratorService;

    public CompanyController(CompanyService companyService, PdfGeneratorService pdfGeneratorService) {
        this.companyService = companyService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerCompany(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("gstNumber") String gstNumber,
            @RequestParam("logo") String logoFile,
            @RequestParam("sqlFile") MultipartFile sqlFile) {

        if (logoFile.isEmpty() || sqlFile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ Both Logo and SQL files are required!");
        }

        try {
            Company company = new Company();
            company.setName(name);
            company.setEmail(email);
            company.setPassword(password);
            company.setPhone(phone);
            company.setGstNumber(gstNumber);
            company.setLogoPath(logoFile);

            companyService.registerCompany(company, sqlFile);

            return ResponseEntity.ok("✅ Company registered successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ File processing error: " + e.getMessage());
        }
    }

    @GetMapping("/{companyName}/quarterly-results")
    public ResponseEntity<?> getQuarterlyResults(@PathVariable String companyName) {
        List<Map<String, Object>> results = companyService.getQuarterlyResults(companyName);
        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ No quarterly data found.");
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{companyName}/aggregated-quarterly-results")
    public ResponseEntity<?> getAggregatedQuarterlyResults(@PathVariable String companyName) {
        Map<String, Map<String, String>> aggregatedResults = companyService.getAggregatedQuarterlyResults(companyName);

        if (aggregatedResults.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ No aggregated data found.");
        }

        return ResponseEntity.ok(aggregatedResults);
    }

    @GetMapping("/{companyName}/download-report/{quarter}")
    public ResponseEntity<byte[]> downloadQuarterlyReport(
            @PathVariable String companyName,
            @PathVariable String quarter) {

        Company company = companyService.getCompanyByName(companyName);

        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Map<String, String[]> quarterMapping = Map.of(
                "Dec_2024", new String[]{"31-12-2024", "dec_2024"},
                "Sept_2024", new String[]{"30-09-2024", "sep_2024"},
                "Jun_2024", new String[]{"30-06-2024", "jun_2024"},
                "March_2024", new String[]{"31-03-2024", "mar_2024"},
                "Dec_2023", new String[]{"31-12-2023", "dec_2023"},
                "Sept_2023", new String[]{"30-09-2023", "sep_2023"},
                "Jun_2023", new String[]{"30-06-2023", "jun_2023"},
                "March_2023", new String[]{"31-03-2023", "mar_2023"},
                "Dec_2022", new String[]{"31-12-2022", "dec_2022"}
        );

        if (!quarterMapping.containsKey(quarter)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        String dueDate = quarterMapping.get(quarter)[0];
        String monthYear = quarterMapping.get(quarter)[1];

        List<Map<String, Object>> quarterlyResults;
        try {
            quarterlyResults = pdfGeneratorService.getQuarterlyResults(companyName, monthYear);
            if (quarterlyResults.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            System.err.println("Error fetching quarterly results: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        try {
            byte[] pdfReport = pdfGeneratorService.generateStatementPdf(
                    company.getName(),
                    company.getLogoPath(),
                    company.getGstNumber(),
                    company.getPhone(),
                    company.getEmail(),
                    dueDate,
                    monthYear
            );

            if (pdfReport == null || pdfReport.length == 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + companyName + "_" + quarter + "_QuarterlyReport.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(pdfReport);

        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}