module.exports = ({
  env
}) => ({
  'fuzzy-search': {
    enabled: true,
    config: {
      contentTypes: [{
        uid: 'api::tag.tag',
        modelName: 'tag',
        transliterate: false,
        queryConstraints: {
          where: {
            '$and': [
              { 
                publishedAt: {
                  '$notNull': true
                }
              },
            ]
          }
        },
        fuzzysortOptions: {
          characterLimit: 32,
          threshold: -600,
          limit: 10,
          keys: [{
            name: 'name',
            weight: 100
          }]
        }
      }]
    }
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    }
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'welcome@futureporn.net',
        defaultReplyTo: 'cj@futureporn.net',
        testAddress: 'grimtech@fastmail.com',
      },
    },
  },
  "users-permissions": {
    config: {
      register: {
        allowedFields: [
          "isNamePublic",
          "isLinkPublic",
          "avatar",
          "vanityLink",
          "patreonBenefits"
        ]
      }
    }
  }
});