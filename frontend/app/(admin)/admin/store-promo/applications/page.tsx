import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const promoApplications = [
  {
    id: "app1",
    applicant: "하늘",
    trackTitle: "여름 끝에서",
    storeName: "카페 봄날",
    plan: "플랜 A (1개월)",
    startDate: "2026-01-15",
    endDate: "2026-02-15",
    status: "active" as const,
  },
  {
    id: "app2",
    applicant: "박현우",
    trackTitle: "서울의 밤",
    storeName: "레코드샵 비닐",
    plan: "플랜 B (2주)",
    startDate: "2026-02-01",
    endDate: "2026-02-15",
    status: "active" as const,
  },
  {
    id: "app3",
    applicant: "이수진",
    trackTitle: "새벽 세시의 고백",
    storeName: "브런치 카페 모닝",
    plan: "플랜 A (1개월)",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    status: "ended" as const,
  },
]

export default function AdminStorePromoApplicationsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">총 {promoApplications.length}건의 홍보 신청</p>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>신청자</TableHead>
                <TableHead>트랙명</TableHead>
                <TableHead>매장</TableHead>
                <TableHead>플랜</TableHead>
                <TableHead>기간</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.applicant}</TableCell>
                  <TableCell className="text-gray-600">{app.trackTitle}</TableCell>
                  <TableCell className="text-gray-600">{app.storeName}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{app.plan}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {app.startDate} ~ {app.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={app.status === "active" ? "default" : "secondary"}
                      className={
                        app.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {app.status === "active" ? "진행 중" : "종료"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
