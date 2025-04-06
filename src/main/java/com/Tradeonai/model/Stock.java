package com.Tradeonai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double priceChange;

    @Column(nullable = false)
    private Double percentChange;

    @Column(nullable = false)
    private String trend;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Stock() {}

    public Stock(String symbol, String companyName, Double price, Double priceChange, Double percentChange, String trend, LocalDateTime timestamp) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.price = price;
        this.priceChange = priceChange;
        this.percentChange = percentChange;
        this.trend = trend;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getPriceChange() {
        return priceChange;
    }

    public void setPriceChange(Double priceChange) {
        this.priceChange = priceChange;
    }

    public Double getPercentChange() {
        return percentChange;
    }

    public void setPercentChange(Double percentChange) {
        this.percentChange = percentChange;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}