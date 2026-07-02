import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { checkNickname } from "@/features/auth/api/authApi";
import { useLoginMutation } from "@/features/auth/queries/useLoginMutation";
import { useAuthStore } from "@/features/auth/stores/authStore";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLoginMutation();
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNickname = nickname.trim();
    try {
      const { available } = await checkNickname(nextNickname);
      const user = await loginMutation.mutateAsync(nextNickname);
      login(user);
      setMessage(available ? "로그인되었습니다." : "닉네임을 확인해주세요.");
      navigate("/home", { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
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
          <Button className="w-full" disabled={loginMutation.isPending}>
            시작하기
          </Button>
        </form>
        {message ? <p className="mt-3 text-xs text-neutral-500">{message}</p> : null}
      </Card>
    </div>
  );
}
