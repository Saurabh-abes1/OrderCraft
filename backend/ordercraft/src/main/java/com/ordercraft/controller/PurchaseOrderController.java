package com.ordercraft.controller;

import com.ordercraft.entity.PurchaseOrder;
import com.ordercraft.entity.Supplier;
import com.ordercraft.service.PurchaseOrderService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    // Create a purchase order
    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderRequest request) {

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        Supplier supplier = new Supplier();
        supplier.setId(request.supplierId());

        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setOrderDate(request.orderDate());
        purchaseOrder.setTotalAmount(request.totalAmount());
        purchaseOrder.setStatus(request.status());

        PurchaseOrder savedPurchaseOrder =
                purchaseOrderService.savePurchaseOrder(purchaseOrder);

        return new ResponseEntity<>(
                savedPurchaseOrder,
                HttpStatus.CREATED
        );
    }

    // Get all purchase orders
    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    // Get purchase order by ID
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(
            @PathVariable Long id) {

        return purchaseOrderService.getPurchaseOrderById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update purchase order
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderRequest request) {

        PurchaseOrder updatedPurchaseOrder = new PurchaseOrder();

        Supplier supplier = new Supplier();
        supplier.setId(request.supplierId());

        updatedPurchaseOrder.setSupplier(supplier);
        updatedPurchaseOrder.setOrderDate(request.orderDate());
        updatedPurchaseOrder.setTotalAmount(request.totalAmount());
        updatedPurchaseOrder.setStatus(request.status());

        return purchaseOrderService
                .updatePurchaseOrder(id, updatedPurchaseOrder)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete purchase order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(
            @PathVariable Long id) {

        if (purchaseOrderService.deletePurchaseOrder(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    // Request data for creating or updating a purchase order
    public record PurchaseOrderRequest(

            @NotNull(message = "Supplier ID is required")
            Long supplierId,

            @NotNull(message = "Order date is required")
            LocalDate orderDate,

            @NotNull(message = "Total amount is required")
            @DecimalMin(
                    value = "0.0",
                    message = "Total amount cannot be negative"
            )
            BigDecimal totalAmount,

            @NotBlank(message = "Status is required")
            String status

    ) {
    }
}