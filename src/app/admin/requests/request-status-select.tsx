"use client";

type Props = {
  type: "DEMO" | "CONTACT";
  id: string;
  status: string;
};

export default function RequestStatusSelect({
  type,
  id,
  status,
}: Props) {
  const requestType = type === "DEMO" ? "demo" : "contact";

  return (
    <form
      action={`/api/admin/requests/${requestType}/${id}`}
      method="post"
    >
      <select
        name="status"
        defaultValue={status}
        onChange={(event) =>
          event.currentTarget.form?.requestSubmit()
        }
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #dce3ed",
          background: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <option value="NEW">Nieuw</option>
        <option value="IN_PROGRESS">
          In behandeling
        </option>
        <option value="CONTACTED">
          Contact opgenomen
        </option>
        <option value="CLOSED">
          Afgesloten
        </option>
      </select>
    </form>
  );
}
