package com.ordercraft.service;

import com.ordercraft.entity.PurchaseOrder;
import com.ordercraft.repository.PurchaseOrderRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    // Create a purchase order
    public PurchaseOrder savePurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    // Get all purchase orders
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    // Get purchase order by ID
    public Optional<PurchaseOrder> getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    // Update purchase order
    public Optional<PurchaseOrder> updatePurchaseOrder(
            Long id, PurchaseOrder updatedPurchaseOrder) {

        return purchaseOrderRepository.findById(id).map(purchaseOrder -> {
            purchaseOrder.setSupplier(updatedPurchaseOrder.getSupplier());
            purchaseOrder.setOrderDate(updatedPurchaseOrder.getOrderDate());
            purchaseOrder.setTotalAmount(updatedPurchaseOrder.getTotalAmount());
            purchaseOrder.setStatus(updatedPurchaseOrder.getStatus());

            return purchaseOrderRepository.save(purchaseOrder);
        });
    }

    // Delete purchase order
    public boolean deletePurchaseOrder(Long id) {
        if (purchaseOrderRepository.existsById(id)) {
            purchaseOrderRepository.deleteById(id);
            return true;
        }

        return false;
    }
}