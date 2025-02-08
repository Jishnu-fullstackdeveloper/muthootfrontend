export default function UserManagementPage({ params }: { params: { segment: string } }) {
  return (
    <div>
      <h2>User Management: {params.segment}</h2>
    </div>
  )
}
