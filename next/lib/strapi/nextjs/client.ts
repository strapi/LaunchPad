import { useRouter } from "next/navigation";
import * as React from "react";

export const useListener = () => {
  const router = useRouter();

  React.useEffect(() => {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/events-subscription`);

    const evtSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/events-subscription`
    );

    evtSource.onmessage = function (event) {
      const payload = JSON.parse(event.data);

      console.log("payload", payload);

      /* Add all the refreshing logic to oonly refresh when it makes sense */

      router.refresh();
    };

    return () => {
      evtSource.close();
    };
  }, []);
};
