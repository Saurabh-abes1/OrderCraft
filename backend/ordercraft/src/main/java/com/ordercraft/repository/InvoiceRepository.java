package com.ordercraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ordercraft.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}