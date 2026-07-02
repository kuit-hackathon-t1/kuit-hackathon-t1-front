import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { checkNickname, loginWithNickname } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/stores/authStore";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const nextNickname = nickname.trim();
    const { available } = await checkNickname(nextNickname);
    const user = await loginWithNickname(nextNickname);
    login(user);
    setMessage(available ? "새 닉네임으로 시작합니다." : "기존 닉네임으로 로그인합니다.");
    setIsSubmitting(false);
    navigate("/home", { replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col justify-center">
      <Card>
        <p className="text-sm font-semibold text-emerald-700">여행 미션 채집</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-neutral-950">
          낯선 장면을 미션으로 발견하고 곤충 표본처럼 모아보세요.
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          AI가 추천하는 랜덤 미션을 수행하고, 사진과 짧은 글을 여행별 채집통에 저장합니다.
        </p>
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <Input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임"
            minLength={2}
            required
          />
          <Button className="w-full" disabled={isSubmitting}>
            시작하기
          </Button>
        </form>
        {message ? <p className="mt-3 text-xs text-neutral-500">{message}</p> : null}
      </Card>
    </div>
  );
}
