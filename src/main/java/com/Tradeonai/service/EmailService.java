package com.Tradeonai.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLoginIdEmail(String toEmail, String loginId, String companyName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Welcome to TradeonAi – Your Account is Active!");

            String htmlContent = "<html><body style='font-family: \"Gill Sans\", \"Gill Sans MT\", Calibri, \"Trebuchet MS\", sans-serif; background-color: #F4F4F4; color: #333; padding: 20px;'>"
                    + "<div style='max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);'>"
                    + "<h2 style='text-align: center; font-size: 26px; color: #002147; margin-bottom: 10px;'>Welcome to TradeonAi</h2>"
                    + "<p style='text-align: center; font-size: 16px; color: #555;'>Your account is now active. Below are your login details.</p>"
                    + "<hr style='border: 1px solid #ddd; margin: 20px 0;'/>"
                    + "<h3 style='color: #002147; font-size: 20px; text-align: center;'>Hello " + companyName + " Team! 🎉</h3>"
                    + "<p style='text-align: center; font-size: 16px; color: #555;'>We are delighted to welcome you to <strong>TradeonAi</strong>. Your registration is now complete, and you can start using our platform.</p>"
                    + "<h4 style='text-align: center; font-size: 18px; color: #333; font-weight: bold;'>Your Unique Login ID</h4>"
                    + "<div style='text-align: center; background-color: #F0F0F0; color: #D9534F; padding: 12px; font-size: 20px; font-weight: bold; border-radius: 5px; max-width: 300px; margin: 10px auto;'>"
                    + loginId + "</div>"
                    + "<p style='text-align: center; font-size: 14px; color: #888;'>Please keep this ID safe. It is required for all future logins.</p>"
                    + "<h4 style='color: #002147; font-size: 18px; margin-top: 20px;'>Next Steps</h4>"
                    + "<ul style='padding-left: 20px; color: #555; font-size: 15px;'>"
                    + "<li><strong>Log in</strong> using your unique Login ID.</li>"
                    + "<li><strong>Explore</strong> AI-powered stock market insights.</li>"
                    + "<li><strong>Customize</strong> your dashboard for real-time updates.</li>"
                    + "<li><strong>Access 24/7 support</strong> for assistance.</li>"
                    + "</ul>"
                    + "<h4 style='color: #002147; font-size: 18px; margin-top: 20px;'>Need Help?</h4>"
                    + "<p style='color: #555;'>If you have any questions, feel free to reach out to our support team:</p>"
                    + "<p><strong>📧 Support Email:</strong> <a href='mailto:support@tradeonai.com' style='color: #D9534F; text-decoration: none;'>support@tradeonai.com</a></p>"
                    + "<p><strong>🌍 Visit Us:</strong> <a href='https://www.tradeon.ai' style='color: #D9534F; text-decoration: none;'>www.tradeon.ai</a></p>"
                    + "<hr style='border: 1px solid #ddd; margin: 20px 0;'/>"
                    + "<p style='text-align: center; font-size: 12px; color: #777;'>This is an automated email. Please do not reply directly.</p>"
                    + "</div>"
                    + "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("❌ Failed to send email.");
        }
    }
}
