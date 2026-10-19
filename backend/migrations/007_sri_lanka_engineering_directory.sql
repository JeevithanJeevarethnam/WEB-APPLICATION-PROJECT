-- Campus directory seed. Apply only after 001 and review names/domains with each institution.
-- Idempotent inserts preserve existing directory records.
INSERT IGNORE INTO universities (name, email_domain, status) VALUES
('University of Moratuwa','uom.lk','active'),
('University of Peradeniya','pdn.ac.lk','active'),
('University of Ruhuna','ruh.ac.lk','active'),
('University of Jaffna','jfn.ac.lk','active'),
('University of Sri Jayewardenepura','sjp.ac.lk','active'),
('The Open University of Sri Lanka','ou.ac.lk','active'),
('General Sir John Kotelawala Defence University','kdu.ac.lk','active'),
('Sri Lanka Institute of Information Technology','sliit.lk','active'),
('NSBM Green University','nsbm.ac.lk','active');
INSERT IGNORE INTO campuses (university_id,name,status)
SELECT id,'Faculty of Engineering','active' FROM universities WHERE name IN ('University of Moratuwa','University of Peradeniya','University of Ruhuna','University of Jaffna','University of Sri Jayewardenepura','The Open University of Sri Lanka','General Sir John Kotelawala Defence University','Sri Lanka Institute of Information Technology','NSBM Green University');
-- Verify institutional domains and faculty titles before using automatic email verification.
