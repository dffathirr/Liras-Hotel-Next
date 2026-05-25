import { Suspense } from "react";
import { PageClient } from "./page.client";

export default function BookingPage() {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  );
}
