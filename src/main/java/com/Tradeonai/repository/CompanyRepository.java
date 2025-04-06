package com.Tradeonai.repository;

import com.Tradeonai.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByEmail(String email);
    Optional<Company> findByLoginId(String loginId);
    Company findByName(String name);
}
