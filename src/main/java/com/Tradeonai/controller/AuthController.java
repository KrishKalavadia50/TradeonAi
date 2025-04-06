package com.Tradeonai.controller;

import com.Tradeonai.model.Company;
import com.Tradeonai.repository.CompanyRepository;
import com.Tradeonai.service.OtpService;
import com.Tradeonai.service.OtpEmailService;
import com.Tradeonai.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private OtpEmailService otpEmailService;


    private final Random random = new Random();


    @PostMapping("/send-otp")
    public Map<String, Object> storeGeneratedCode(@RequestBody Map<String, String> request) {
        String loginId = request.get("loginId");
        Optional<Company> company = companyRepository.findByLoginId(loginId);

        if (company.isEmpty()) {
            return Map.of("success", false, "message", "Company not found!");
        }

        String email = company.get().getEmail();
        String otp = String.format("%06d", random.nextInt(999999)); // Generate 6-digit OTP

        otpService.storeGeneratedCode(loginId, otp); // Store OTP
        otpEmailService.sendOtpEmail(email, otp); // Send OTP via email

        return Map.of("success", true, "message", "OTP sent successfully to your registered email.");
    }


    @PostMapping("/verify-otp")
    public Map<String, Object> verifyGeneratedCode(@RequestBody Map<String, String> request) {
        String loginId = request.get("loginId");
        String otp = request.get("otp");

        if (otpService.verifyGeneratedCode(loginId, otp)) {
            Optional<Company> company = companyRepository.findByLoginId(loginId);
            if (company.isPresent()) {

                return Map.of("success", true, "message", "OTP verified successfully!", "companyId", company.get().getId(), "companyName", company.get().getName(), "logo", company.get().getLogoPath());
            }
        }
        return Map.of("success", false, "message", "Invalid OTP. Try again!");
    }


    @GetMapping("/dashboard/{companyId}")
    public Map<String, Object> getCompanyDashboard(@PathVariable Long companyId) {
        Optional<Company> company = companyRepository.findById(companyId);
        if (company.isPresent()) {
            return Map.of("success", true, "dashboardData", "Company-specific SQL data for " + company.get().getName());
        }
        return Map.of("success", false, "message", "Company not found!");
    }
}
