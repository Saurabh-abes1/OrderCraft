package com.ordercraft.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ordercraft.entity.Invoice;
import com.ordercraft.repository.InvoiceRepository;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Optional<Invoice> existingInvoice = invoiceRepository.findById(id);

        if (existingInvoice.isPresent()) {
            Invoice invoice = existingInvoice.get();

            invoice.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
            invoice.setInvoiceDate(updatedInvoice.getInvoiceDate());
            invoice.setTotalAmount(updatedInvoice.getTotalAmount());
            invoice.setStatus(updatedInvoice.getStatus());

            return invoiceRepository.save(invoice);
        }

        return null;
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}