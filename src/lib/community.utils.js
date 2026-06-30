export const DELETED_DISCUSSION_CONTENT = "This discussion has been deleted.";

export function isDiscussionDeleted(content) {
  return content === DELETED_DISCUSSION_CONTENT;
}
