#!/bin/bash

# Script de diagnostic pour Gateway Timeout Traefik + Strapi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  DIAGNOSTIC GATEWAY TIMEOUT - TRAEFIK + STRAPI${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# 1. Vérifier que les conteneurs tournent
echo -e "${YELLOW}1. État des conteneurs${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker ps --filter "name=wx-refonte-site" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# 2. Vérifier les logs Strapi
echo -e "${YELLOW}2. Logs Strapi (dernières 50 lignes)${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker logs --tail 50 wx-refonte-site-strapi 2>&1 | grep -v "node_modules" | tail -20
echo ""

# 3. Vérifier si Strapi écoute sur le port
echo -e "${YELLOW}3. Strapi écoute-t-il sur le port 1337 ?${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker exec wx-refonte-site-strapi netstat -tlnp 2>/dev/null | grep 1337 || \
docker exec wx-refonte-site-strapi ss -tlnp 2>/dev/null | grep 1337 || \
echo -e "${RED}⚠️  Impossible de vérifier (netstat/ss non disponible)${NC}"
echo ""

# 4. Test de connexion interne
echo -e "${YELLOW}4. Test de connexion interne (depuis le conteneur)${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker exec wx-refonte-site-strapi wget -q -O- http://localhost:1337/_health 2>&1 || \
docker exec wx-refonte-site-strapi curl -s http://localhost:1337/_health 2>&1 || \
echo -e "${RED}⚠️  Pas de réponse sur localhost:1337${NC}"
echo ""

# 5. Vérifier les labels Traefik
echo -e "${YELLOW}5. Labels Traefik du conteneur Strapi${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker inspect wx-refonte-site-strapi --format='{{range $key, $value := .Config.Labels}}{{$key}}={{$value}}{{println}}{{end}}' | grep traefik
echo ""

# 6. Vérifier le réseau
echo -e "${YELLOW}6. Réseaux du conteneur Strapi${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker inspect wx-refonte-site-strapi --format='{{range $net, $config := .NetworkSettings.Networks}}{{$net}}: {{$config.IPAddress}}{{println}}{{end}}'
echo ""

# 7. Vérifier que Traefik peut voir Strapi
echo -e "${YELLOW}7. Traefik voit-il le service Strapi ?${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
if docker ps | grep -q traefik; then
    TRAEFIK_CONTAINER=$(docker ps --filter "name=traefik" --format "{{.Names}}" | head -1)
    echo "Conteneur Traefik: $TRAEFIK_CONTAINER"
    
    # Vérifier si Traefik peut pinger Strapi
    docker exec $TRAEFIK_CONTAINER ping -c 2 wx-refonte-site-strapi 2>&1 || \
    echo -e "${RED}⚠️  Traefik ne peut pas joindre Strapi${NC}"
else
    echo -e "${RED}⚠️  Aucun conteneur Traefik trouvé${NC}"
fi
echo ""

# 8. Vérifier les logs Traefik
echo -e "${YELLOW}8. Logs Traefik (recherche d'erreurs Strapi)${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
if docker ps | grep -q traefik; then
    TRAEFIK_CONTAINER=$(docker ps --filter "name=traefik" --format "{{.Names}}" | head -1)
    docker logs --tail 100 $TRAEFIK_CONTAINER 2>&1 | grep -i "strapi\|wx-refonte\|preprod-api" | tail -10
else
    echo -e "${RED}⚠️  Aucun conteneur Traefik trouvé${NC}"
fi
echo ""

# 9. Test DNS
echo -e "${YELLOW}9. Résolution DNS dans le réseau Docker${NC}"
echo -e "${YELLOW}─────────────────────────────────────────────────────────${NC}"
docker exec wx-refonte-site-strapi nslookup wx-refonte-site-strapi 2>&1 || \
docker exec wx-refonte-site-strapi getent hosts wx-refonte-site-strapi 2>&1 || \
echo -e "${YELLOW}⚠️  Outils DNS non disponibles${NC}"
echo ""

# 10. Résumé et recommandations
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  RÉSUMÉ ET RECOMMANDATIONS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Vérifier si Strapi est vraiment démarré
if docker logs wx-refonte-site-strapi 2>&1 | grep -q "Server started"; then
    echo -e "${GREEN}✅ Strapi semble démarré${NC}"
else
    echo -e "${RED}❌ Strapi ne semble pas démarré complètement${NC}"
    echo -e "${YELLOW}   → Vérifiez les logs complets: docker compose logs -f strapi${NC}"
fi

# Vérifier le réseau Traefik
if docker network ls | grep -q traefik-platform-network; then
    echo -e "${GREEN}✅ Réseau traefik-platform-network existe${NC}"
    
    # Vérifier que Strapi est sur ce réseau
    if docker inspect wx-refonte-site-strapi --format='{{range $net, $config := .NetworkSettings.Networks}}{{$net}}{{println}}{{end}}' | grep -q traefik-platform-network; then
        echo -e "${GREEN}✅ Strapi est connecté au réseau Traefik${NC}"
    else
        echo -e "${RED}❌ Strapi N'EST PAS sur le réseau traefik-platform-network${NC}"
        echo -e "${YELLOW}   → Solution: docker network connect traefik-platform-network wx-refonte-site-strapi${NC}"
    fi
else
    echo -e "${RED}❌ Réseau traefik-platform-network n'existe pas${NC}"
    echo -e "${YELLOW}   → Créez-le: docker network create traefik-platform-network${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"