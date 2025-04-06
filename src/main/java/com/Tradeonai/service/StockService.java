package com.Tradeonai.service;

import com.Tradeonai.model.Stock;
import com.Tradeonai.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    private static final Logger LOGGER = Logger.getLogger(StockService.class.getName());
    private static final String ACCESS_KEY = "8d6e0f2e6de840d445e03457e60601de";
    private static final String API_URL = "http://api.marketstack.com/v1/eod/latest?access_key=" + ACCESS_KEY + "&symbols={symbol}";

    public Stock fetchStockData(String symbol, String name) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            Map<String, Object> response = restTemplate.getForObject(API_URL, Map.class, symbol);

            LOGGER.info("Raw API Response for " + symbol + ": " + response);

            if (response == null || !response.containsKey("data")) {
                LOGGER.warning("Invalid response for: " + symbol);
                return null;
            }

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.get("data");
            if (dataList.isEmpty()) {
                LOGGER.warning("No data returned for symbol: " + symbol);
                return null;
            }

            Map<String, Object> stockData = dataList.get(0);
            Double price = parseDouble(stockData.get("close"));
            Double open = parseDouble(stockData.get("open"));
            Double change = price - open;
            Double percentChange = (change / open) * 100;
            String trend = (change >= 0) ? "UP" : "DOWN";

            Stock stock = new Stock(symbol, name, price, change, percentChange, trend, LocalDateTime.now());
            Stock savedStock = stockRepository.save(stock);

            // Log for terminal and Postman
            LOGGER.info("\uD83D\uDCC8 Fetched stock data: " + symbol + ", Trend: " + trend);
            return savedStock;
        } catch (Exception e) {
            LOGGER.severe("Failed to fetch stock data for: " + symbol + " - " + e.getMessage());
            return null;
        }
    }

    public List<Stock> fetchMultipleStocks(List<String> symbols) {
        return symbols.stream()
                .map(symbol -> fetchStockData(symbol, symbol.toUpperCase()))
                .filter(stock -> stock != null)
                .collect(Collectors.toList());
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @KafkaListener(topics = "stock-fetch-requests", groupId = "stock-group")
    @KafkaListener(topics = "stock-fetch-requests", groupId = "stock-group")
    public void consumeStockFetchRequest(String symbol) {
        LOGGER.info("📥 Received Kafka request to fetch stock data for: " + symbol);

        Stock stock = fetchStockData(symbol, symbol.toUpperCase());

        if (stock != null) {
            LOGGER.info("📊 Fetched data for " + symbol + ": Price = " + stock.getPrice() + ", Change = " + stock.getPriceChange() + ", Trend = " + stock.getTrend());
            LOGGER.info("✅ Successfully fetched and stored stock data: " + symbol);
        } else {
            LOGGER.warning("❌ Failed to fetch stock data for: " + symbol);
        }
    }


    // Scheduled method to automatically refresh stocks every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void autoUpdateStocks() {
        LOGGER.info("\u23F0 Starting scheduled stock data refresh...");
        List<Stock> existingStocks = stockRepository.findAll();
        for (Stock stock : existingStocks) {
            fetchStockData(stock.getSymbol(), stock.getSymbol());
        }
        LOGGER.info("\u2705 Finished scheduled stock update.");
    }

    public List<Stock> getPositiveStocks() {
        return stockRepository.findAll().stream()
                .filter(stock -> stock.getPriceChange() > 0)
                .collect(Collectors.toList());
    }

    private Double parseDouble(Object value) {
        try {
            if (value instanceof String) {
                return Double.valueOf(((String) value).replace("%", ""));
            }
            return Double.valueOf(String.valueOf(value));
        } catch (Exception e) {
            LOGGER.warning("Failed to parse double value: " + value);
            return 0.0;
        }
    }
}