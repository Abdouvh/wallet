package com.SmartWallet.wallet.repositories;

import com.SmartWallet.wallet.entities.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByUserId(Long userId);
}