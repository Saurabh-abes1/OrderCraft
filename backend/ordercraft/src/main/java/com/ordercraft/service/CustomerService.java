
package com.ordercraft.service;

import com.ordercraft.entity.Customer;
import com.ordercraft.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    // Constructor injection
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Add customer
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // Update customer
    public Optional<Customer> updateCustomer(Long id, Customer updatedCustomer) {

        return customerRepository.findById(id).map(customer -> {

            customer.setCustomerName(updatedCustomer.getCustomerName());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setCompanyName(updatedCustomer.getCompanyName());

            return customerRepository.save(customer);
        });
    }

    // Delete customer
    public boolean deleteCustomer(Long id) {

        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }

        return false;
    }
}