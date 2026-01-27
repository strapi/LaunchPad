export default () => ({
  // Désactiver les workflows de révision
  // Cela évite les erreurs lors de l'import de données
  'review-workflows': {
    enabled: false,
  },

  // Configuration du plugin Upload (optionnel)
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },

  // Configuration du plugin Users & Permissions (optionnel)
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
