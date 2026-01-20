# Quick Reference: Coolify + Billing Setup

## 🎯 Your Action Plan

### Week 1: Infrastructure
```
Day 1-2:   Pick VPS provider (DigitalOcean, Hetzner, etc)
Day 3:     SSH into VPS, run setup-coolify.sh
Day 4-5:   Configure Strapi in Coolify dashboard
Day 5-6:   Configure Next.js in Coolify dashboard
Day 7:     Test deployments, verify SSL
```

### Week 2: Billing System
```
Day 1:     Create Stripe account + get API keys
Day 2-3:   Create Strapi schemas (customer, invoice, payment)
Day 4:     Implement Stripe checkout API
Day 5:     Implement webhook handler
Day 6:     Build billing dashboard component
Day 7:     Test entire payment flow
```

### Week 3: Go Live
```
Day 1-2:   Final testing with real card
Day 3:     Add to production environment
Day 4:     Create customer documentation
Day 5-7:   Launch to first client + monitor
```

---

## 💰 Pricing Template

Copy this to your marketing website:

```
STARTER PLAN
$99/month
Perfect for new coaches
- Up to 50 clients
- 10GB file storage
- 100,000 API calls/month
- Email support
- Standard features

PROFESSIONAL PLAN
$199/month
For growing coaching practices
- Up to 200 clients
- 50GB file storage
- 500,000 API calls/month
- Priority email support
- Advanced analytics
- Custom branding

ENTERPRISE PLAN
$499/month
For large organizations
- Unlimited clients
- 500GB file storage
- Unlimited API calls
- 24/7 priority support
- Dedicated account manager
- Custom integrations
```

---

## 🔑 Required API Keys & Secrets

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_SECRET=min-32-characters-long
DATABASE_PASSWORD=strong-postgres-password
STRAPI_API_TOKEN=generated-from-strapi-admin
```

**Never commit these to git!** Use environment variables only.

---

## 📊 Monitoring Commands

```bash
# Check Coolify apps
docker ps

# View Next.js logs
docker logs $(docker ps -q --filter "ancestor=peter-sung-next")

# View Strapi logs
docker logs $(docker ps -q --filter "ancestor=peter-sung-strapi")

# Check PostgreSQL
docker exec coolify-postgres psql -U postgres -l

# Monitor resource usage
docker stats

# Check certificate expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🛡️ Security Checklist

- [ ] Change default Coolify admin password
- [ ] Enable 2FA on Coolify dashboard
- [ ] Set up firewall rules on VPS
- [ ] Enable Stripe test mode first
- [ ] Use HTTPS everywhere
- [ ] Rotate secrets after deployment
- [ ] Enable database backups
- [ ] Set up monitoring alerts
- [ ] Document runbook for your team

---

## 💵 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| VPS (DigitalOcean 4GB) | $24/mo | Scale as needed |
| Database backups | $5/mo | Automatic in Coolify |
| Domain (.com) | $12/mo | Via GoDaddy, Namecheap, etc |
| Email (Resend) | $20/mo | Send transactional emails |
| Stripe fees | ~3% | On customer payments |
| **Total** | **~$109/mo** | For 5 customers |

With 5 customers at Starter tier = $1,591 revenue - $109 cost = **$1,482 profit/month**

---

## 📧 Customer Communication Template

### Onboarding Email
```
Hi [Customer Name],

Welcome to Peter Sung Coaching Platform!

Your account is now active and ready to use.

📊 YOUR PLAN: [TIER]
💳 Billing date: [DATE]
💰 Amount: $[PRICE]/month
📱 Dashboard: https://yourdomain.com/dashboard

GETTING STARTED:
1. Log in to your dashboard
2. Add your coaching clients
3. Upload resources
4. Start using the AI chat

NEED HELP?
📖 Docs: https://docs.yourdomain.com
💬 Email: support@yourdomain.com
🎥 Video tutorials: https://youtube.com/@yourdomain

Questions? Reply to this email!

Best regards,
Peter Sung Team
```

### Payment Failed Email
```
Hi [Customer Name],

Your recent subscription payment failed: $[AMOUNT]

This might be due to:
- Expired or invalid card
- Insufficient funds
- Card fraud detection

⚠️ UPDATE PAYMENT METHOD
Visit: https://yourdomain.com/dashboard/billing

Your account will be suspended in 7 days if we can't process this payment.

Need help? Contact: support@yourdomain.com
```

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Test with 1 internal user first
- [ ] Verify all forms work and validate
- [ ] Check email notifications send
- [ ] Test payment flow with test card
- [ ] Verify invoices generate correctly
- [ ] Check error pages (404, 500, etc)
- [ ] Load test the application
- [ ] Review security settings
- [ ] Backup database
- [ ] Document admin procedures

### After Going Live
- [ ] Monitor error logs
- [ ] Watch payment processing
- [ ] Respond to support emails
- [ ] Track customer feedback
- [ ] Monitor server resources
- [ ] Update documentation as needed
- [ ] Plan first feature release

---

## Test Card Numbers (Stripe)

```
VISA:           4242 4242 4242 4242
VISA (debit):   4000 0566 5566 5556
Mastercard:     5555 5555 5555 4444
American Express: 3782 822463 10005
Discover:       6011 1111 1111 1117
```

Exp: Any future date | CVC: Any 3-4 digits

---

## Scaling Plan

### Month 1-3: Foundation
- 2-5 customers
- Single $24 VPS
- Monitor performance
- Gather feedback

### Month 4-6: Growth
- 5-15 customers
- Upgrade to 4GB VPS if needed ($24 → $48)
- Add Redis cache
- Optimize database queries

### Month 7-12: Scale
- 15-30 customers
- Upgrade to 8GB VPS ($96/mo)
- Add CDN for static files
- Consider load balancing

### Year 2+: Enterprise
- 30+ customers
- Dedicated Coolify instances per customer
- Custom infrastructure
- Managed services

---

## Support Resources

- **Coolify Docs**: https://coolify.io/docs
- **Strapi Docs**: https://docs.strapi.io
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## Success Metrics to Track

```
Monthly metrics:
- New customers acquired
- Churn rate (cancelled subscriptions)
- Average revenue per user (ARPU)
- Uptime percentage
- Average response time
- Error rate
- Customer satisfaction score

Financial:
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime customer value (LTV)
- Profit margin
- Runway (months before cash runs out)
```

---

## Next Quick Win

✅ **This Week**: Reserve domain, sign up for VPS and Stripe
✅ **Next Week**: Deploy to Coolify, test payment flow
✅ **Week 3**: Launch to first paying customer!

Ready to go? Start with the COOLIFY_HOSTING_BILLING.md file for detailed setup.
