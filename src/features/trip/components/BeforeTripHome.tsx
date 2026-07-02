import { Link } from "react-router";

import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";

export default function BeforeTripHome() {
  return (
    <EmptyState
      title="진행 중인 여행이 없습니다"
      description="새 여행을 만들면 AI 랜덤 미션과 채집 기록을 시작할 수 있습니다."
      action={
        <Link to="/trips/new">
          <Button>새 여행 만들기</Button>
        </Link>
      }
    />
  );
}
