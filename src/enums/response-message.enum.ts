export enum ResponseMessage {
  CREATE_USER_SUCCESS = "User successfully created",
  CREATE_USER_FAIL = "User cannot be created",
  DELETE_USER_SUCCESS = "User successfully deleted",
  DELETE_USER_FAIL = "User cannot be deleted",
  GET_USER_SUCCESS = "User successfully retrieved",
  GET_USER_FAIL = "User not found",
  UPDATE_USER_SUCCESS = "User successfully updated",
  UPDATE_USER_FAIL = "User cannot be updated",
  USER_LOGIN_SUCCESS = "User successfully authorized",
  USER_LOGIN_FAIL = "User cannot be authorized",
  USER_LOGOUT_SUCCESS = "User successfully logged out",
  USER_LOGOUT_FAIL = "User cannot be logged out",

  ERROR = "Unknown error.",
  INVALID_REQUEST = "Invalid Request!",
  GET_ITEM_ERROR = "Item does not exist",
}
