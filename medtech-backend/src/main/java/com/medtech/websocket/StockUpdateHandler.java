package com.medtech.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class StockUpdateHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public StockUpdateHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendStockUpdate(Long hospitalId, Long resourceId, Integer newQuantity) {
        StockUpdatePayload payload = new StockUpdatePayload(hospitalId, resourceId, newQuantity);
        messagingTemplate.convertAndSend("/topic/stock-updates", payload);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockUpdatePayload {
        private Long hospitalId;
        private Long resourceId;
        private Integer newQuantity;
    }
}
