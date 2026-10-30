package com.ordercraft.controller;

import com.ordercraft.entity.Bom;
import com.ordercraft.entity.Product;
import com.ordercraft.service.BomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boms")
public class BomController {

    private final BomService bomService;

    public BomController(BomService bomService) {
        this.bomService = bomService;
    }

    // Add a BOM item
    @PostMapping
    public ResponseEntity<Bom> createBom(@Valid @RequestBody BomRequest request) {
        Bom bom = new Bom();

        Product product = new Product();
        product.setId(request.productId());

        bom.setProduct(product);
        bom.setMaterialName(request.materialName());
        bom.setQuantity(request.quantity());
        bom.setUnit(request.unit());

        Bom savedBom = bomService.saveBom(bom);
        return new ResponseEntity<>(savedBom, HttpStatus.CREATED);
    }

    // Get all BOM items
    @GetMapping
    public List<Bom> getAllBoms() {
        return bomService.getAllBoms();
    }

    // Get BOM items for a product
    @GetMapping("/product/{productId}")
    public List<Bom> getBomsByProductId(@PathVariable Long productId) {
        return bomService.getBomsByProductId(productId);
    }

    // Update an existing BOM item
    @PutMapping("/{id}")
    public ResponseEntity<Bom> updateBom(
            @PathVariable Long id,
            @Valid @RequestBody BomRequest request) {

        Bom updatedBom = new Bom();
        updatedBom.setMaterialName(request.materialName());
        updatedBom.setQuantity(request.quantity());
        updatedBom.setUnit(request.unit());

        return bomService.updateBom(id, updatedBom)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a BOM item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBom(@PathVariable Long id) {
        if (bomService.deleteBom(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    // Request data for creating or updating a BOM item
    public record BomRequest(
            Long productId,
            String materialName,
            java.math.BigDecimal quantity,
            String unit
    ) {
    }
}