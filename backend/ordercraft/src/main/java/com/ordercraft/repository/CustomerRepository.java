
package com.ordercraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ordercraft.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}