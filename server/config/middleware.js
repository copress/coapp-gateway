module.exports = {
  "initial:before": {
    "expressx#logger": {
      "enabled": true,
      "params": "combined"
    },
    "connect-powered-by": {
      "params": "sycle-gateway"
    },
    "cors": {
    },
    "strong-express-metrics": {
    }
  },
  "initial": {
    "compression": {
      "params": {
        "threshold": "4kb"
      }
    },
    "body-parser#urlencoded": {
      "params": { "extended": false }
    },
    "body-parser#json": {},
    "method-override": {}
  },
  "session": {
    "express-session": {
      "params": {
        "saveUninitialized": true,
        "resave": true,
        "secret": "keyboard cat"
      }
    }
  },
  "auth": {
    "copress-component-oauth2#authenticate": {
      "paths": [
        "/_internal",
        "/protected",
        "/api",
        "/me"
      ],
      "params": {
        "session": false,
        "scopes": {
          "demo": [
            "/me", "/protected", "/_internal", "/api/note"
          ],
          "note": [
            {
              "methods": "all",
              "path": "/api/note"
            }
          ]
        }
      }
    }
  },
  "routes:before": {
    "./middleware/https-redirect": {}
  },

  "routes:after": {
    "./middleware/rate-limiting-policy": {
      "paths": ["/api", "/protected"],
      "params": {
        "limit": 100,
        "interval": 60000,
        "keys": {
          "app": {
            "template": "app-${app.id}",
            "limit": 1000
          },
          "ip": 500,
          "url": {
            "template": "url-${urlPaths[0]}/${urlPaths[1]}",
            "limit": 1000
          },
          "user": {
            "template": "user-${user.id}",
            "limit": 1000
          },
          "app,user": {
            "template": "app-${app.id}-user-${user.id}",
            "limit": 1000
          }
        }
      }
    },
    "./middleware/proxy": {
      "params": {
        "rules": [
          "^/api/(.*)$ http://localhost:3002/api/$1 [P]",
          "^/protected/(.*)$ http://localhost:3000/protected/$1 [P]"
        ]
      }
    }
  },
  "files": {
    "serve-static": [
      {
        "params": "$!../../client/public",
        "paths": ["/"]
      },
      {
        "params": "$!../../client/admin",
        "paths": ["/admin"]
      }
    ]
  },
  "final": {
    "expressx#urlNotFound": {}
  },
  "final:after": {
    "errorhandler": {"params": {"log": true}}
  }
};