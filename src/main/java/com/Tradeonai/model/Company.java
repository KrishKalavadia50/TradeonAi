package com.Tradeonai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(name = "gst_number", nullable = false, unique = true)
    private String gstNumber;

    @Column(name = "logo_url", length = 500)
    private String logoPath;

    @Column(name = "sql_file_path", length = 500)
    private String sqlFilePath;

    @Column(unique = true, updatable = false)
    private String loginId;
}

