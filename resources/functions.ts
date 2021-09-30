export default {
  createUser: {
    handler: "handler.createUser",
    events: [
      {
        http: {
          method: "POST",
          path: "users",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
           authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  getUser: {
    handler: "handler.getUser",
    events: [
      {
        http: {
          method: "GET",
          path: "users/{userEmail}",
           cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
           authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  getUsers: {
    handler: "handler.getUsers",
    events: [
      {
        http: {
          method: "GET",
          path: "users",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
          authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  updateUser: {
    handler: "handler.updateUser",
    events: [
      {
        http: {
          method: "PUT",
          path: "users/{userEmail}",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
          authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  deleteUser: {
    handler: "handler.deleteUser",
    events: [
      {
        http: {
          method: "DELETE",
          path: "users/{userEmail}",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
          authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  changeUserRole: {
    handler: "handler.changeUserRole",
    events: [
      {
        http: {
          method: "POST",
          path: "users/{userEmail}/role",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
          authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  auth: {
    handler: "handler.authorizer"
  },
  loginUser: {
    handler: "handler.loginUser",
    events: [
      {
        http: {
          method: "GET",
          path: "users/login",
          cors: true
        },
      },
    ],
  },
   logoutUser: {
    handler: "handler.logoutUser",
    events: [
      {
        http: {
          method: "POST",
          path: "users/logout",
          cors: {
            origin: "*",
            headers: [
              "Content-Type",
              "X-Amz-Date",
              "Authorization",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ],
            allowCredentials: true
          },
          authorizer: {
            name: "auth",
            resultTtlInSeconds: 0,
            identitySource: "method.request.header.Authorization",
            type: "token"
          }
        },
      },
    ],
  },
  postSaml: {
    handler: "handler.postSaml",
    events: [
      {
        http: {
          method: "post",
          path: "auth/saml",
          cors: true
        },
      },
    ],
  }
};
