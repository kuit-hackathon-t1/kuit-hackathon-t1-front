import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { useLoginMutation } from "@/features/auth/queries/useLoginMutation";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { cn } from "@/shared/lib/cn";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

const introSlides = [
  {
    title: "여행 속 청춘의 순간을 채집해요",
    description: "여행지에서 스쳐 지나가는 간판, 바람, 그림자, 이상한 순간들. 그 순간을 모아 청춘도감으로 만들어봐요.",
    image: "/images/onboarding/butterfly-specimen.png",
    fallback: "나비 표본",
  },
  {
    title: "미션을 통해 더 많은 추억을 남겨요",
    description: "다양한 유형의 미션을 새롭게 뽑아 도전해봐요",
    image: "/images/onboarding/mission-card.png",
    fallback: "미션 카드",
  },
  {
    title: "실패한 순간도 추억으로 남겨요",
    description: "완료한 미션은 선명한 사진 조각으로, 실패한 미션은 반투명하게 모든 순간을 기억해요",
    image: "/images/onboarding/beetle-specimen.png",
    fallback: "흐린 표본",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLoginMutation();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (step !== 0) return;
    const timer = window.setTimeout(() => setStep(1), 1800);
    return () => window.clearTimeout(timer);
  }, [step]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNickname = nickname.trim();

    if (nextNickname.length < 1 || nextNickname.length > 15) {
      setMessage("닉네임은 1자 이상 15자 이하로 입력해주세요.");
      return;
    }

    try {
      const user = await loginMutation.mutateAsync(nextNickname);
      login(user);
      navigate("/home", { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  }

  return (
    <div className="relative -mx-5 -my-6 flex min-h-dvh flex-col overflow-hidden bg-[#FFFFF7] px-6 py-8">
      {step === 0 ? (
        <SplashSlide onNext={() => setStep(1)} />
      ) : step < 4 ? (
        <IntroSlide
          slide={introSlides[step - 1]}
          step={step}
          onNext={() => setStep((current) => current + 1)}
        />
      ) : (
        <form className="flex min-h-[calc(100dvh-64px)] flex-col" onSubmit={handleSubmit}>
          <div className="pt-16">
            <p className="text-sm font-semibold text-primary">채집가 이름</p>
            <h1 className="mt-3 text-3xl font-bold leading-10 text-black-950">
              청춘도감에서 사용할 채집가 이름을 정해주세요
            </h1>
            <Input
              className="mt-8 min-h-14 rounded-2xl bg-white px-4 text-base shadow-card placeholder:text-gray-400"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setMessage("");
              }}
              placeholder="예: 경주, 부산 해운대..."
              minLength={1}
              maxLength={15}
              required
            />
            <p className="mt-3 text-xs text-gray-600">{nickname.trim().length}/15</p>
            {message ? <p className="mt-4 text-sm text-danger">{message}</p> : null}
          </div>
          <div className="mt-auto pb-3">
            <Button fullWidth size="lg" disabled={loginMutation.isPending || nickname.trim().length < 1 || nickname.trim().length > 15}>
              청춘도감 시작하기
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SplashSlide({ onNext }: { onNext: () => void }) {
  return (
    <section
      className="relative flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center text-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0,143,93,0.08), rgba(255,255,247,0.95)), url('/images/onboarding/splash-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute left-8 top-20 h-16 w-16 rotate-12 rounded-full border border-white/80 bg-white/50" />
      <div className="absolute right-8 top-36 h-20 w-20 -rotate-12 rounded-full border border-primary/20 bg-primary-soft" />
      <p className="text-sm font-semibold text-primary">여행 미션 채집</p>
      <h1 className="mt-4 text-5xl font-bold text-black-950">청춘도감</h1>
      <p className="mt-5 max-w-64 text-sm leading-6 text-black-700">스쳐 지나간 여행의 순간을 표본처럼 모아요</p>
      <Button className="absolute bottom-5 left-0 right-0 mx-auto w-[calc(100%-24px)] max-w-[360px]" size="lg" onClick={onNext}>
        다음
      </Button>
    </section>
  );
}

function IntroSlide({
  slide,
  step,
  onNext,
}: {
  slide: (typeof introSlides)[number];
  step: number;
  onNext: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col">
      <div className="pt-12">
        <div className="flex gap-2" aria-label={`온보딩 ${step} / 4`}>
          {[1, 2, 3, 4].map((item) => (
            <span key={item} className={cn("h-1 flex-1 rounded-full", item <= step ? "bg-primary" : "bg-gray-200")} />
          ))}
        </div>
        <h1 className="mt-10 text-3xl font-bold leading-10 text-black-950">{slide.title}</h1>
        <p className="mt-4 text-base leading-7 text-black-700">{slide.description}</p>
      </div>
      <div className="mt-10 flex flex-1 items-center justify-center">
        {!imageFailed ? (
          <img
            className="max-h-72 w-full rounded-[32px] object-contain"
            src={slide.image}
            alt={slide.fallback}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex aspect-square w-full max-w-72 rotate-[-4deg] items-center justify-center rounded-[32px] border border-dashed border-primary/40 bg-white text-sm font-semibold text-primary shadow-card">
            {slide.fallback}
          </div>
        )}
      </div>
      <div className="pb-3">
        <Button fullWidth size="lg" onClick={onNext}>
          다음
        </Button>
      </div>
    </section>
  );
}
