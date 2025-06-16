import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("Index");
  return (
    <div className="bg-charcoal h-dvh max-h-dvh flex flex-col">
      <div className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold bg-white bg-clip-text text-transparent">
          {t("title")}
          <br />
          <span className="text-purple">IMPOSTOR</span>
        </h1>
        <div className="relative size-80 mx-auto">
          <Image
            src="/images/impostor-logo.webp"
            alt="Impostor Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-400 text-lg m-0">{t("slogan")}</p>
        <Button
          asChild
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 mt-4"
        >
          <Link href="/game-setup">{t("startGame")}</Link>
        </Button>
      </div>

      <div className="text-center py-1 text-gray-500 text-sm">
        © {new Date().getFullYear()} Mark Knotzer
      </div>
    </div>
  );
}
