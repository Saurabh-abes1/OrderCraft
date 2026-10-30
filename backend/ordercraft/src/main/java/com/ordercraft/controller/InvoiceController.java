package com.ordercraft.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ordercraft.entity.Customer;
import com.ordercraft.entity.Invoice;
import com.ordercraft.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody InvoiceRequest request) {
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber(request.invoiceNumber());
        invoice.setInvoiceDate(request.invoiceDate());
        invoice.setTotalAmount(request.totalAmount());
        invoice.setStatus(request.status());

        Customer customer = new Customer();
        customer.setId(request.customerId());
        invoice.setCustomer(customer);

        return invoiceService.saveInvoice(invoice);
    }

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable Long id,
            @RequestBody InvoiceRequest request) {

        Invoice updatedInvoice = new Invoice();
        updatedInvoice.setInvoiceNumber(request.invoiceNumber());
        updatedInvoice.setInvoiceDate(request.invoiceDate());
        updatedInvoice.setTotalAmount(request.totalAmount());
        updatedInvoice.setStatus(request.status());

        Invoice result = invoiceService.updateInvoice(id, updatedInvoice);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    public record InvoiceRequest(
            Long customerId,
            String invoiceNumber,
            java.time.LocalDate invoiceDate,
            java.math.BigDecimal totalAmount,
            String status) {
    }
}