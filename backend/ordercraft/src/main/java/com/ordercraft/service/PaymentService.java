package com.ordercraft.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ordercraft.entity.Invoice;
import com.ordercraft.entity.Payment;
import com.ordercraft.repository.InvoiceRepository;
import com.ordercraft.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Payment savePayment(Payment payment) {
        Long invoiceId = payment.getInvoice().getId();

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        payment.setInvoice(invoice);

        Payment savedPayment = paymentRepository.save(payment);

        updateInvoiceStatus(invoice);

        return savedPayment;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Invoice invoice = payment.getInvoice();

        paymentRepository.delete(payment);

        updateInvoiceStatus(invoice);
    }

    private void updateInvoiceStatus(Invoice invoice) {
        BigDecimal totalPaid =
                paymentRepository.getTotalPaidByInvoiceId(invoice.getId());

        BigDecimal totalAmount = invoice.getTotalAmount();

        if (totalPaid.compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setStatus("UNPAID");
        } else if (totalPaid.compareTo(totalAmount) >= 0) {
            invoice.setStatus("PAID");
        } else {
            invoice.setStatus("PARTIALLY_PAID");
        }

        invoiceRepository.save(invoice);
    }
}