"use client";

export default function DeletePostButton({
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  return (
    <button
      className="blog-delete"
      type="submit"
      name="intent"
      value="delete"
      onClick={(event) => {
        const confirmed = window.confirm(
          `Delete "${postTitle}"?\n\nThis cannot be undone.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      Artikel verwijderen
    </button>
  );
}
