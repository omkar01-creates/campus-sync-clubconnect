-- CampusConnect sample data
-- Run after schema.sql:  mysql -u root -p campusconnect < backend/database/sample.sql
-- Demo student accounts (password for both: student123)
--   rahul@student.com
--   priya@student.com
-- No admin account is included here. See README "Create an admin account".

USE campusconnect;

-- Password hash below = bcrypt hash of "student123"
INSERT INTO users (name, email, password, role) VALUES
('Rahul Sharma', 'rahul@student.com', '$2a$10$nbBkZu91dQUXmDbURQzwP.PZatGqBuYdl0avXpekN3aDBxKMTHcIy', 'STUDENT'),
('Priya Patil', 'priya@student.com', '$2a$10$nbBkZu91dQUXmDbURQzwP.PZatGqBuYdl0avXpekN3aDBxKMTHcIy', 'STUDENT');

INSERT INTO clubs (name, description, category) VALUES
('Coding Club', 'The Coding Club is a community of tech enthusiasts who love to code, build projects, learn new technologies, and organize workshops and hackathons.', 'Technology'),
('Photography Club', 'Capture moments, create stories. We organize photo walks, editing sessions and exhibitions.', 'Arts'),
('Drama Club', 'Act. Perform. Express. Street plays, stage dramas and acting workshops all year round.', 'Culture'),
('Music Club', 'Feel the rhythm together. Jam sessions, open mics and band performances.', 'Music'),
('Sports Club', 'Play. Compete. Grow. Football, cricket, athletics and inter-college tournaments.', 'Sports'),
('Literary Club', 'For all book lovers. Book reviews, debates, poetry and creative writing.', 'Literature');

INSERT INTO events (club_id, name, description, date, venue) VALUES
(1, 'Tech Fest 2026', 'Tech Fest is an annual technical event featuring workshops, hackathons, project exhibitions, and expert talks from industry professionals.', '2026-11-10', 'Seminar Hall'),
(2, 'Photography Walk', 'A guided photo walk around the campus followed by a short editing session.', '2026-11-15', 'Main Campus'),
(3, 'Cultural Night', 'An evening of drama, dance and music performances by students.', '2026-11-28', 'Auditorium'),
(1, 'Web Development Bootcamp', 'Hands-on bootcamp covering HTML, CSS, JavaScript, React and Node.js.', '2026-12-05', 'Lab 2'),
(5, 'Sports Tournament', 'Inter-department football and cricket tournament.', '2026-12-12', 'Playground'),
(4, 'Open Mic', 'Sing, play or perform poetry on the open stage.', '2026-12-20', 'Main Stage');

-- Rahul has joined 2 clubs and registered for 3 events
INSERT INTO club_members (user_id, club_id) VALUES (1, 1), (1, 2), (2, 3);
INSERT INTO registrations (user_id, event_id) VALUES (1, 1), (1, 2), (1, 5), (2, 3);
