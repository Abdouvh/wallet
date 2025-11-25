package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.entities.PaymentRequest;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.PaymentRequestRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import com.SmartWallet.wallet.services.TransferService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    private final PaymentRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final TransferService transferService;

    // 1. Create a Request
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody RequestDTO dto) {
        User requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        // Find payer by username/email logic (simplified here to ID for now, or username if preferred)
        // Ideally, frontend sends username/email, backend finds ID.
        // For consistency with previous features, let's assume frontend sends "targetId" (User ID) or "email".
        // Let's stick to User ID for the API input to be precise, or email if you prefer friendly UI.
        // Let's use Payer ID for simplicity in this step.
        User payer = userRepository.findById(dto.getPayerId())
                .orElseThrow(() -> new RuntimeException("Payer not found"));

        if (requester.getId().equals(payer.getId())) {
            return ResponseEntity.badRequest().body("Cannot request money from yourself.");
        }

        PaymentRequest req = new PaymentRequest();
        req.setRequester(requester);
        req.setPayer(payer);
        req.setAmount(dto.getAmount());
        req.setStatus(PaymentRequest.RequestStatus.PENDING);
        req.setTimestamp(LocalDateTime.now());

        requestRepository.save(req);
        return ResponseEntity.ok("Request sent successfully!");
    }

    // 2. Get My Requests (Incoming & Outgoing)
    @GetMapping("/{userId}/incoming")
    public ResponseEntity<List<PaymentRequest>> getIncoming(@PathVariable Long userId) {
        return ResponseEntity.ok(requestRepository.findByPayerId(userId));
    }

    @GetMapping("/{userId}/outgoing")
    public ResponseEntity<List<PaymentRequest>> getOutgoing(@PathVariable Long userId) {
        return ResponseEntity.ok(requestRepository.findByRequesterId(userId));
    }

    // 3. Pay a Request
    @PostMapping("/{requestId}/pay")
    public ResponseEntity<?> payRequest(@PathVariable Long requestId) {
        PaymentRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != PaymentRequest.RequestStatus.PENDING) {
            return ResponseEntity.badRequest().body("Request is already processed.");
        }

        // Execute Transfer (Payer -> Requester)
        // Note: Payer's Account ID -> Requester's Account ID
        transferService.transferFunds(
                req.getPayer().getAccount().getId(),
                req.getRequester().getAccount().getId(),
                req.getAmount()
        );

        req.setStatus(PaymentRequest.RequestStatus.PAID);
        requestRepository.save(req);

        return ResponseEntity.ok("Payment successful!");
    }

    // 4. Decline a Request
    @PostMapping("/{requestId}/decline")
    public ResponseEntity<?> declineRequest(@PathVariable Long requestId) {
        PaymentRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != PaymentRequest.RequestStatus.PENDING) {
            return ResponseEntity.badRequest().body("Request is already processed.");
        }

        req.setStatus(PaymentRequest.RequestStatus.DECLINED);
        requestRepository.save(req);

        return ResponseEntity.ok("Request declined.");
    }

    @Data
    static class RequestDTO {
        private Long requesterId;
        private Long payerId; // Or username/email
        private BigDecimal amount;
    }
}