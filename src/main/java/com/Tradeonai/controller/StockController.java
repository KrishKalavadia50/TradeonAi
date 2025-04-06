package com.Tradeonai.controller;

import com.Tradeonai.model.Stock;
import com.Tradeonai.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/fetch/{symbol}")
    public ResponseEntity<Stock> fetchStock(@PathVariable String symbol) {
        try {
            Stock stock = stockService.fetchStockData(symbol, symbol.toUpperCase());
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Stock>> getAllStocks() {
        try {
            return ResponseEntity.ok(stockService.getAllStocks());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/fetch-multiple")
    public ResponseEntity<List<Stock>> fetchMultipleStocks(@RequestBody List<String> symbols) {
        try {
            return ResponseEntity.ok(stockService.fetchMultipleStocks(symbols));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
