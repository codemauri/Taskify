#!/bin/bash

DB_PATH="./prisma/dev.db"

# Insert demo user
sqlite3 "$DB_PATH" <<EOF
INSERT OR IGNORE INTO User (id, email, name, createdAt, updatedAt) 
VALUES ('demo-user-id', 'demo@taskify.com', 'Demo User', datetime('now'), datetime('now'));

-- Insert projects
INSERT INTO Project (id, title, description, userId, createdAt, updatedAt) 
VALUES 
  ('proj-1', 'Website Redesign', 'Complete overhaul of company website with modern design', 'demo-user-id', datetime('now', '-7 days'), datetime('now', '-1 day')),
  ('proj-2', 'Mobile App Development', 'Build cross-platform mobile application using React Native', 'demo-user-id', datetime('now', '-14 days'), datetime('now', '-2 hours')),
  ('proj-3', 'Documentation Update', 'Update all technical documentation for Q4', 'demo-user-id', datetime('now', '-3 days'), datetime('now', '-5 hours'));

-- Insert tasks for Website Redesign
INSERT INTO Task (id, title, description, status, projectId, createdAt, updatedAt) 
VALUES 
  ('task-1', 'Design mockups', 'Create initial design concepts and mockups', 'Done', 'proj-1', datetime('now', '-7 days'), datetime('now', '-5 days')),
  ('task-2', 'Implement responsive layout', 'Build responsive components for all screen sizes', 'In Progress', 'proj-1', datetime('now', '-5 days'), datetime('now', '-1 day')),
  ('task-3', 'SEO optimization', 'Optimize metadata and content for search engines', 'Incomplete', 'proj-1', datetime('now', '-4 days'), datetime('now', '-4 days'));

-- Insert tasks for Mobile App Development
INSERT INTO Task (id, title, description, status, projectId, createdAt, updatedAt) 
VALUES 
  ('task-4', 'Setup development environment', 'Configure React Native and required dependencies', 'Done', 'proj-2', datetime('now', '-14 days'), datetime('now', '-12 days')),
  ('task-5', 'Build authentication flow', 'Implement login, signup, and password reset', 'In Progress', 'proj-2', datetime('now', '-10 days'), datetime('now', '-2 hours')),
  ('task-6', 'Create user dashboard', 'Design and implement main dashboard UI', 'In Progress', 'proj-2', datetime('now', '-8 days'), datetime('now', '-3 hours')),
  ('task-7', 'Integrate API endpoints', 'Connect frontend to backend API', 'Incomplete', 'proj-2', datetime('now', '-6 days'), datetime('now', '-6 days'));

-- Insert tasks for Documentation Update
INSERT INTO Task (id, title, description, status, projectId, createdAt, updatedAt) 
VALUES 
  ('task-8', 'Review existing docs', 'Audit current documentation for accuracy', 'Done', 'proj-3', datetime('now', '-3 days'), datetime('now', '-2 days')),
  ('task-9', 'Write API documentation', 'Document all REST API endpoints', 'Incomplete', 'proj-3', datetime('now', '-2 days'), datetime('now', '-5 hours'));
EOF

echo "Database seeded successfully!"
