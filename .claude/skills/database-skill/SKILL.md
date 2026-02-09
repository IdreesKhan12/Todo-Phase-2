---
name: database-skill
description: Design relational database schemas, create tables, and manage migrations safely and efficiently.
---

# Database Skill – Schema Design & Migrations

## Instructions

1. **Schema design**
   - Identify entities and relationships
   - Normalize data (avoid redundancy)
   - Choose appropriate data types
   - Define primary keys and foreign keys

2. **Table creation**
   - Use clear, consistent naming conventions
   - Add constraints (NOT NULL, UNIQUE, CHECK)
   - Design indexes for performance
   - Support soft deletes when required

3. **Migrations**
   - Create forward and rollback-safe migrations
   - Version migrations sequentially
   - Avoid destructive changes without data backups
   - Handle schema evolution (add/modify columns safely)

4. **Relationships**
   - One-to-one, one-to-many, many-to-many
   - Proper foreign key constraints
   - Cascading rules (ON DELETE / ON UPDATE)

5. **Environment awareness**
   - Support dev, staging, and production databases
   - Keep migrations idempotent where possible

## Best Practices
- Design schema before writing application logic
- Prefer explicit constraints over application-only validation
- Index columns used in joins and filters
- Avoid premature optimization, but plan for scale
- Always test migrations on a non-production database

## Example Structure
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
