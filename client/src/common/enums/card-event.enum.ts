const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  RENAME: "card:rename",
  CHANGE_DESCRIPTION: "card:change-description",
  DELETE: "card:delete",
  CLONE: "card:clone",
} as const;

export { CardEvent };
