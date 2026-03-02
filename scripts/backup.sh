#!/bin/bash

# Database Backup Script for Production
# This script creates encrypted backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/var/backups/rand-training-college"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="rk_institute_backup_$DATE.sql"
ENCRYPTED_FILE="$BACKUP_FILE.gpg"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
echo "🗄️  Creating database backup..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/$BACKUP_FILE"

# Encrypt backup
echo "🔒 Encrypting backup..."
gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output "$BACKUP_DIR/$ENCRYPTED_FILE" "$BACKUP_DIR/$BACKUP_FILE"

# Remove unencrypted backup
rm "$BACKUP_DIR/$BACKUP_FILE"

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.gpg" -mtime +30 -delete

echo "✅ Backup completed: $ENCRYPTED_FILE"
