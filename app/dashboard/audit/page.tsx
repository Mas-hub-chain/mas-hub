import { AuditTrail } from "@/components/audit/audit-trail"

export default function AuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-600 mt-2">Complete system activity and security audit log</p>
      </div>

      <AuditTrail />
    </div>
  )
}
