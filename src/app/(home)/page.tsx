import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("Index");
  return (
    <div className="bg-charcoal flex h-dvh max-h-dvh flex-col">
      <div className="container mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="bg-white bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {t("title")}
          <br />
          <span className="text-purple">IMPOSTOR</span>
        </h1>
        <div className="relative mx-auto size-80">
          <Image
            src="/images/impostor-logo.webp"
            alt="Impostor Logo"
            fill
            sizes="320px"
            className="object-contain"
            priority
          />
        </div>
        <p className="m-0 text-lg text-gray-400">{t("slogan")}</p>
        <Button
          asChild
          className="mt-4 h-14 w-full border-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-lg hover:from-purple-700 hover:to-indigo-700"
        >
          <Link href="/game" className="text-white">
            {t("startGame")}
          </Link>
        </Button>
      </div>

      <div className="pb-3 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Mark Knotzer
      </div>
    </div>
  );
}
