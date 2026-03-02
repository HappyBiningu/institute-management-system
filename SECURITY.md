# 🔒 Rand Training College Management System - Security Guide

## **📋 Security Overview**

This document outlines the comprehensive security measures implemented in the Rand Training College Management System and provides configuration guidelines for production deployment.

## **🛡️ Security Architecture**

### **Multi-Layer Security Approach**

1. **Network Security** - Firewall, SSL/TLS, DDoS protection
2. **Application Security** - Input validation, authentication, authorization
3. **Data Security** - Encryption, secure storage, backup protection
4. **Infrastructure Security** - Server hardening, monitoring, logging

---

## **🔐 Authentication & Authorization**

### **JWT-Based Authentication**

- **Algorithm**: HS256 with secure secret key
- **Token Expiry**: 4 hours (configurable)
- **Refresh Strategy**: Automatic token refresh
- **Storage**: Secure HTTP-only cookies (recommended)

### **Role-Based Access Control (RBAC)**

```typescript
// User Roles
ADMIN     - Full system access
TEACHER   - Course and student management
PARENT    - Family and payment access
STUDENT   - Read-only access to own data
```

### **Security Configuration**

```bash
# Environment Variables
JWT_SECRET="minimum-32-character-secure-random-string"
JWT_EXPIRY="4h"
BCRYPT_ROUNDS="14"  # Higher for production
```

---

## **🚫 Rate Limiting & DDoS Protection**

### **Multi-Tier Rate Limiting**

```javascript
// Authentication endpoints
AUTH_RATE_LIMIT: 5 requests per 15 minutes

// General API endpoints
API_RATE_LIMIT: 100 requests per 15 minutes

// Strict endpoints (admin actions)
STRICT_RATE_LIMIT: 10 requests per minute
```

### **Configuration**

```bash
RATE_LIMIT_WINDOW="900000"  # 15 minutes
RATE_LIMIT_MAX="100"        # Max requests
```

---

## **🔍 Input Validation & Sanitization**

### **Validation Schema**

- **Email**: RFC 5322 compliant validation
- **Password**: Minimum 8 characters, complexity requirements
- **Names**: Alphanumeric with spaces, hyphens, apostrophes
- **Phone**: International format validation
- **Amounts**: Positive numbers with decimal precision
- **UUIDs**: Strict UUID v4 format

### **XSS Prevention**

- HTML tag removal from user inputs
- JavaScript protocol blocking
- Event handler attribute removal
- Content Security Policy (CSP) headers

### **SQL Injection Prevention**

- Prisma ORM with parameterized queries
- Input type validation
- Query result sanitization

---

## **🌐 Security Headers**

### **Implemented Headers**

```javascript
// Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'

// XSS Protection
X-XSS-Protection: 1; mode=block

// Content Type Options
X-Content-Type-Options: nosniff

// Frame Options
X-Frame-Options: DENY

// HSTS (HTTPS Strict Transport Security)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

// Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin
```

### **CORS Configuration**

```javascript
// Production CORS Settings
origin: 'https://your-domain.com';
credentials: true;
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
allowedHeaders: ['Content-Type', 'Authorization'];
```

---

## **🗄️ Database Security**

### **Connection Security**

- SSL/TLS encrypted connections
- Connection pooling with limits
- Prepared statements only
- Database user with minimal privileges

### **Data Encryption**

- **Passwords**: Bcrypt with salt rounds 14+
- **Sensitive Data**: AES-256 encryption for PII
- **Database**: Encrypted at rest (cloud providers)
- **Backups**: Encrypted backup storage

### **Database Configuration**

```sql
-- Create dedicated user with limited privileges
CREATE USER rk_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE rk_institute TO rk_app;
GRANT USAGE ON SCHEMA public TO rk_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rk_app;
```

---

## **📝 Audit Logging**

### **Logged Events**

- User authentication (success/failure)
- Data modifications (create, update, delete)
- Administrative actions
- Security events (rate limit hits, validation failures)
- System errors and exceptions

### **Log Format**

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "event": "USER_LOGIN",
  "userId": "uuid",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "success": true,
    "method": "email"
  }
}
```

### **Log Management**

- **Retention**: 90 days minimum
- **Storage**: Secure, encrypted storage
- **Access**: Restricted to authorized personnel
- **Monitoring**: Real-time alerting for security events

---

## **🔧 Server Hardening**

### **Operating System Security**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Disable unnecessary services
sudo systemctl disable apache2
sudo systemctl disable sendmail

# Configure SSH security
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
```

### **Node.js Security**

```bash
# Use specific Node.js version
nvm use 18.19.0

# Audit dependencies
npm audit fix

# Use production dependencies only
npm ci --production

# Set secure file permissions
chmod 600 .env.production
chmod 755 -R public/
```

---

## **🚨 Security Monitoring**

### **Real-Time Monitoring**

- Failed authentication attempts
- Rate limit violations
- Unusual access patterns
- Database connection failures
- Application errors

### **Alerting Configuration**

```bash
# Example: Monitor failed logins
tail -f /var/log/rand-training-college/audit.log | grep "LOGIN_FAILED" | \
while read line; do
  echo "Security Alert: $line" | mail -s "Security Alert" admin@company.com
done
```

### **Health Check Endpoints**

```javascript
// Security health checks
GET /api/health/security
{
  "rateLimit": "operational",
  "authentication": "operational",
  "database": "operational",
  "encryption": "operational"
}
```

---

## **🔄 Backup Security**

### **Backup Encryption**

```bash
# Encrypted database backup
pg_dump rk_institute | gpg --cipher-algo AES256 --compress-algo 1 \
  --symmetric --output backup_$(date +%Y%m%d).sql.gpg

# Secure backup storage
aws s3 cp backup_$(date +%Y%m%d).sql.gpg s3://secure-backups/ \
  --server-side-encryption AES256
```

### **Backup Access Control**

- Separate backup user with read-only access
- Encrypted backup files
- Secure backup storage location
- Regular backup integrity testing

---

## **🔐 SSL/TLS Configuration**

### **Certificate Management**

```bash
# Let's Encrypt with auto-renewal
sudo certbot --nginx -d your-domain.com
sudo crontab -e
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **SSL Configuration (Nginx)**

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
```

---

## **🚨 Incident Response**

### **Security Incident Procedures**

1. **Detection** - Monitor alerts and logs
2. **Assessment** - Determine severity and impact
3. **Containment** - Isolate affected systems
4. **Investigation** - Analyze logs and evidence
5. **Recovery** - Restore normal operations
6. **Documentation** - Record incident details

### **Emergency Contacts**

```bash
# Security team contacts
SECURITY_EMAIL="security@company.com"
ADMIN_PHONE="+1234567890"
INCIDENT_RESPONSE_TEAM="incident@company.com"
```

---

## **✅ Security Checklist**

### **Pre-Deployment Security Checklist**

- [ ] Environment variables configured securely
- [ ] Database user has minimal privileges
- [ ] SSL/TLS certificates installed and configured
- [ ] Firewall rules configured properly
- [ ] Rate limiting enabled and tested
- [ ] Security headers implemented
- [ ] Audit logging enabled
- [ ] Backup encryption configured
- [ ] Monitoring and alerting set up
- [ ] Security incident response plan in place

### **Regular Security Maintenance**

- [ ] Weekly security updates
- [ ] Monthly dependency audits
- [ ] Quarterly security assessments
- [ ] Annual penetration testing
- [ ] Continuous log monitoring
- [ ] Regular backup testing

---

## **📞 Security Support**

### **Reporting Security Issues**

- **Email**: security@company.com
- **Response Time**: 24 hours for critical issues
- **Encryption**: Use PGP key for sensitive reports

### **Security Resources**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

**🎯 This security guide ensures enterprise-grade protection for the Rand Training College Management System in production environments.**
