import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function DummyPage(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.push("/projects");
  });
  return <div>This page is not used - redirected to projects/index.tsx</div>;
}
