package com.Tradeonai.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final ConcurrentHashMap<String, String> codeStorage = new ConcurrentHashMap<>();


    public void storeGeneratedCode(String loginId, String code) {
        codeStorage.put(loginId, code);
    }


    public boolean verifyGeneratedCode(String loginId, String inputCode) {
        String storedCode = codeStorage.get(loginId);
        return storedCode != null && storedCode.equals(inputCode);
    }
}
