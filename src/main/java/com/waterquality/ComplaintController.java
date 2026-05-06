package com.waterquality;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // Frontend se connection allow karne ke liye
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Sabhi complaints ko fetch karne ke liye
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
      }

    // Nayi complaint submit karne ke liye
    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        if (complaint.getStatus() == null) {
            complaint.setStatus("PENDING"); // Default status set karna
        }
        return complaintRepository.save(complaint);
    }

    // Status update (Resolve button) ke liye[cite: 1]
    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id, @RequestBody Complaint details) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(id);
        
        if (optionalComplaint.isPresent()) {
            Complaint complaint = optionalComplaint.get();
            // Sirf status update kar rahe hain
            complaint.setStatus(details.getStatus()); 
            Complaint updatedComplaint = complaintRepository.save(complaint);
            return ResponseEntity.ok(updatedComplaint);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Complaint delete karne ke liye
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable Long id) {
        try {
            complaintRepository.deleteById(id);
            return ResponseEntity.ok("Complaint deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting complaint");
        }
    }
}