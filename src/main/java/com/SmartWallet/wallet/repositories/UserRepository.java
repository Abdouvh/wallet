package com.SmartWallet.wallet.repositories;

import com.SmartWallet.wallet.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email); // <--- ADD THIS LINE
    Boolean existsByUsername(String username);
}