package com.ordercraft.service;

import com.ordercraft.entity.Bom;
import com.ordercraft.repository.BomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BomService {

    private final BomRepository bomRepository;

    public BomService(BomRepository bomRepository) {
        this.bomRepository = bomRepository;
    }

    // Add a BOM item
    public Bom saveBom(Bom bom) {
        return bomRepository.save(bom);
    }

    // Get all BOM items
    public List<Bom> getAllBoms() {
        return bomRepository.findAll();
    }

    // Get BOM item by ID
    public Optional<Bom> getBomById(Long id) {
        return bomRepository.findById(id);
    }

    // Get BOM items for a particular product
    public List<Bom> getBomsByProductId(Long productId) {
        return bomRepository.findByProductId(productId);
    }

    // Update an existing BOM item
    public Optional<Bom> updateBom(Long id, Bom updatedBom) {
        return bomRepository.findById(id).map(bom -> {
            bom.setMaterialName(updatedBom.getMaterialName());
            bom.setQuantity(updatedBom.getQuantity());
            bom.setUnit(updatedBom.getUnit());

            return bomRepository.save(bom);
        });
    }

    // Delete a BOM item
    public boolean deleteBom(Long id) {
        if (bomRepository.existsById(id)) {
            bomRepository.deleteById(id);
            return true;
        }

        return false;
    }
}