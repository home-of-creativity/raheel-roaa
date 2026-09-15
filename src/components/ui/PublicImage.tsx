import Image, { type ImageProps } from "next/image";
import { publicAsset } from "@/src/lib/publicPath";

export function PublicImage({ src, ...props }: ImageProps) {
  const resolved =
    typeof src === "string" && src.startsWith("/") && !src.startsWith("//")
      ? publicAsset(src)
      : src;

  return <Image src={resolved} {...props} />;
}
