# Installation et Configuration du Formulaire Dynamique Vtiger

## 📋 Structure des fichiers

```
votre-projet/
├── app/
│   ├── api/
│   │   └── vtiger-contact/
│   │       └── route.ts          # Route API pour Vtiger
│   └── contact/
│       └── page.tsx               # Page de contact
├── components/
│   ├── VtigerBlockForm.tsx        # Composant formulaire Vtiger
│   ├── DynamicStrapiForm.tsx      # Composant principal piloté par Strapi
│   ├── BlockForm.tsx              # (optionnel) Formulaire générique
│   └── FieldRenderer.tsx          # (existant) Rendu des champs
├── hooks/
│   └── useVtiger.ts               # Hook pour Vtiger
├── lib/
│   └── services/
│       └── vtiger-service.ts      # Service Vtiger
└── types/
    └── strapi-form.ts             # Types TypeScript
```

## 🚀 Installation

### 1. Configuration de Strapi

#### a. Créer le Content Type "Form Configuration"

Dans Strapi (Content-Type Builder) :

1. Allez dans **Content-Type Builder**
2. Cliquez sur **Create new collection type**
3. Nom : `form-config`
4. Ajoutez les champs suivants :

| Champ | Type | Options |
|-------|------|---------|
| formName | Text | Required, Unique |
| title | Text | Required |
| description | Long text | - |
| submitButtonText | Text | Default: "Envoyer" |
| successMessage | Text | - |
| errorMessage | Text | - |
| vtigerEndpoint | Text | - |
| vtigerModuleType | Enumeration | Values: "Leads", "Contacts" |
| vtigerMapping | JSON | Required |
| fields | JSON | Required |
| displayConfig | JSON | - |

5. Sauvegardez et redémarrez Strapi

#### b. Configurer les permissions

1. Allez dans **Settings → Roles → Public**
2. Dans **Form-config**, cochez :
   - ✅ find
   - ✅ findOne
3. Sauvegardez

#### c. Créer un formulaire de contact

1. Allez dans **Content Manager → Form Configuration**
2. Créez une nouvelle entrée
3. Copiez/collez le contenu de `strapi-form-example.json`
4. Publiez

### 2. Configuration de Vtiger

#### a. Obtenir les credentials

1. Connectez-vous à votre instance Vtiger
2. Allez dans **My Preferences → Access Key**
3. Copiez votre **Access Key**

#### b. Variables d'environnement

Créez/modifiez `.env.local` :

```bash
# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_token

# Vtiger (NE PAS préfixer par NEXT_PUBLIC_)
VTIGER_URL=https://your-vtiger.com
VTIGER_USERNAME=admin
VTIGER_ACCESS_KEY=your_access_key
```

### 3. Installation des dépendances

Toutes les dépendances sont déjà présentes dans votre `package.json` ✅

### 4. Créer les fichiers

Créez tous les fichiers fournis dans les artefacts :

1. `types/strapi-form.ts`
2. `lib/services/vtiger-service.ts`
3. `hooks/useVtiger.ts`
4. `app/api/vtiger-contact/route.ts`
5. `components/VtigerBlockForm.tsx`
6. `components/DynamicStrapiForm.tsx`
7. `app/contact/page.tsx`

## 🧪 Test

### 1. Démarrer le projet

```bash
npm run dev
```

### 2. Tester le formulaire

Allez sur : `http://localhost:3000/contact`

### 3. Vérifier la soumission

1. Remplissez le formulaire
2. Cliquez sur "Envoyer"
3. Vérifiez dans Vtiger que le Lead/Contact a été créé

## 🎨 Personnalisation

### Modifier le formulaire depuis Strapi

1. Allez dans Strapi → Form Configuration
2. Modifiez les champs JSON :

```json
{
  "name": "nouveau_champ",
  "type": "text",
  "label": "Nouveau champ",
  "required": true
}
```

3. Sauvegardez
4. Le formulaire se mettra à jour automatiquement (cache 60s)

### Ajouter un nouveau type de champ

Dans `VtigerBlockForm.tsx`, fonction `buildZodSchema()` :

```typescript
case 'date':
  fieldSchema = z.date();
  break;
```

### Personnaliser le design

Modifiez `displayConfig` dans Strapi :

```json
{
  "layout": "two-columns",
  "containerClassName": "bg-gradient-to-r from-blue-50 to-white p-10 rounded-2xl",
  "fieldsClassName": "grid grid-cols-1 lg:grid-cols-3 gap-6"
}
```

## 🔧 Dépannage

### Erreur : "Failed to fetch form config"

- Vérifiez que Strapi est démarré
- Vérifiez `NEXT_PUBLIC_STRAPI_URL` dans `.env.local`
- Vérifiez les permissions Strapi (Public → find/findOne)

### Erreur : "Failed to login to Vtiger"

- Vérifiez `VTIGER_URL`, `VTIGER_USERNAME`, `VTIGER_ACCESS_KEY`
- Vérifiez que l'Access Key est valide dans Vtiger
- Redémarrez Next.js après modification des variables d'environnement

### Le formulaire ne s'affiche pas

- Vérifiez que `formName` dans Strapi correspond à celui utilisé dans `getStrapiFormConfig()`
- Vérifiez que l'entrée est **Published** dans Strapi

### Erreur de type TypeScript

Si vous avez l'erreur sur `zodResolver`, c'est normal, le `as any` est nécessaire pour le moment. Assurez-vous d'avoir :

```typescript
resolver: zodResolver(schema) as any
```

## 📚 Utilisation avancée

### Créer plusieurs formulaires

1. Dans Strapi, créez plusieurs entrées (contact, devis, newsletter, etc.)
2. Utilisez des `formName` différents
3. Créez des pages différentes :

```typescript
// app/devis/page.tsx
const formConfig = await getStrapiFormConfig("devis-form");
```

### Mapping personnalisé Vtiger

Dans Strapi, `vtigerMapping` :

```json
{
  "nom_formulaire": "champ_vtiger",
  "email": "email",
  "telephone": "phone",
  "entreprise": "company"
}
```

## 🎯 Prochaines étapes

- [ ] Ajouter des validations personnalisées
- [ ] Gérer les fichiers (upload)
- [ ] Ajouter reCAPTCHA
- [ ] Créer un dashboard d'administration
- [ ] Ajouter des webhooks Strapi → Vtiger