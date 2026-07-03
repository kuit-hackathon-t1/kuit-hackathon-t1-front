import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { useLoginMutation } from "@/features/auth/queries/useLoginMutation";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { ApiError } from "@/shared/api/ApiError";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

const introSlides = [
  {
    title: "여행 속\n청춘의 순간을\n채집해요",
    description: "여행지에서 스쳐 지나가는 간판, 바람, 그림자, 이상한 순간들. 그 순간을 모아 청춘도감으로 만들어봐요.",
    image: "/images/onboarding/intro-butterfly.png",
    fallback: "나비 표본",
  },
  {
    title: "미션을 통해\n더 많은 추억을 남겨요",
    description: "다양한 유형의 미션을 새롭게 뽑아 도전해봐요",
    image: "/images/onboarding/mission-card-sample.png",
    fallback: "미션 카드",
  },
  {
    title: "실패한 순간도\n추억으로 남겨요",
    description: "완료한 미션은 선명한 사진 조각으로, 실패한 미션은 반투명하게 모든 순간을 기억해요",
    image: "/images/onboarding/intro-beetle.png",
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
      if (error instanceof ApiError && error.status === 409) {
        setMessage("이미 다른 채집가가 사용 중인 이름이에요.");
        return;
      }

      setMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  }

  return (
    <div
      className="relative -mx-5 -my-6 flex min-h-dvh flex-col overflow-hidden px-6 py-8"
      style={{ background: "linear-gradient(180deg, #FBFCF2 23.73%, #008F0E 297.71%)" }}
    >
      {step === 0 ? (
        <SplashSlide />
      ) : step < 4 ? (
        <IntroSlide
          slide={introSlides[step - 1]}
          step={step}
          onNext={() => setStep((current) => current + 1)}
        />
      ) : (
        <form className="flex min-h-[calc(100dvh-64px)] flex-col" onSubmit={handleSubmit}>
          <div className="pt-16">
            <h1 className="mt-3 text-subtitle-24 font-bold leading-10 text-black-950">
              청춘도감에서 사용할
              <br />
              채집가 이름을 정해주세요
            </h1>
            <Input
              className="mt-8 min-h-14 rounded-2xl bg-white px-4 text-base shadow-card placeholder:text-gray-400"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setMessage("");
              }}
              placeholder="예: 여름수집가"
              minLength={1}
              maxLength={15}
              required
            />
            <p className="mt-3 text-xs text-gray-600">{nickname.trim().length}/15</p>
            {message ? <p className="mt-4 text-body-12 text-danger">{message}</p> : null}
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

function SplashSlide() {
  return (
    <section
      className="relative -mx-6 -my-8 flex min-h-dvh flex-col items-center justify-center overflow-hidden text-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.04), rgba(0,0,0,0.12)), url('/images/onboarding/splash-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        className="pointer-events-none absolute top-[18%] left-[3%] w-[43%] max-w-[170px] select-none"
        src="/images/onboarding/butterfly-white.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="pointer-events-none absolute top-[51%] right-[5%] w-[13%] max-w-[52px] select-none"
        src="/images/onboarding/dragonfly-white.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="pointer-events-none absolute top-[59%] left-[11%] w-[30%] max-w-[118px] select-none"
        src="/images/onboarding/beetle-white.png"
        alt=""
        aria-hidden="true"
      />

      <div className="relative z-10">
        <p className="font-jandari text-subtitle-20 text-white">여행에서 기록하는 나의 청춘</p>
        <h1 className="mt-4 font-jandari text-[64px] font-normal not-italic leading-none tracking-[-1.04px] text-white">
          청춘도감
        </h1>
      </div>
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

  if (step === 3) {
    return (
      <section className="flex min-h-[calc(100dvh-64px)] flex-col" aria-label="온보딩 3 / 4">
        <div className="relative min-h-[360px] flex-1">
          <img
            className="absolute top-[20%] left-[16%] w-[90vw] max-w-[347px]"
            src="/images/onboarding/failed-memory-placeholder.png"
            alt="성공과 실패의 순간이 함께 담긴 청춘도감"
          />
        </div>

        <div className="mb-10">
          <h1 className="font-jandari text-[40px] font-normal not-italic leading-[120%] whitespace-pre-line text-black-800">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-[310px] text-body-12 text-black-700">{slide.description}</p>
        </div>

        <div className="pb-3">
          <Button fullWidth variant="greenOutline" size="lg" onClick={onNext}>
            다음
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col" aria-label={`온보딩 ${step} / 4`}>
      <div className={step === 3 ? "pt-6" : "pt-10"}>
        <h1 className="font-jandari text-[40px] font-normal not-italic leading-[120%] whitespace-pre-line text-black-800">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-[310px] text-body-12 text-black-700">
          {slide.description}
        </p>
      </div>

      {step === 1 ? (
        <div className="relative mt-2 min-h-[330px] flex-1">
          <img
            className="absolute top-[1%] right-[-3%] w-[63%] max-w-[240px]"
            src="/images/onboarding/intro-butterfly.png"
            alt="꽃과 여행 풍경으로 채워진 나비 조각"
          />
          <img
            className="absolute top-[43%] left-[14%] w-[50%] max-w-[189px]"
            src="/images/onboarding/intro-beetle.png"
            alt="여행 음식으로 채워진 곤충 조각"
          />
          <img
            className="absolute top-[68%] right-[5%] w-[33%] max-w-[125px]"
            src="/images/onboarding/intro-dragonfly.png"
            alt="여행 사진으로 채워진 곤충 조각"
          />
        </div>
      ) : step === 2 ? (
        <div className="relative mt-4 min-h-[330px] flex-1">
          <img
            className="absolute top-[8%] left-[-2%] z-10 w-[72%] max-w-[275px]"
            src="/images/onboarding/mission-card-sample.png"
            alt="목적 없이 10분 걷기 미션 카드"
          />
          <img
            className="absolute top-[40%] right-[-3%] w-[76%] max-w-[290px]"
            src="/images/onboarding/mission-card-sample2.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="mt-10 flex flex-1 items-center justify-center">
          {!imageFailed ? (
            <img
              className="max-h-72 w-full rounded-[32px] object-contain"
              src={slide.image}
              alt={slide.fallback}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex aspect-square w-full max-w-72 rotate-[-4deg] items-center justify-center rounded-[32px] border border-dashed border-primary/40 bg-white font-jandari text-sm font-semibold text-primary shadow-card">
              {slide.fallback}
            </div>
          )}
        </div>
      )}

      <div className="pb-3">
        <Button fullWidth variant="greenOutline" size="lg" onClick={onNext}>
          다음
        </Button>
      </div>
    </section>
  );
}
