import {
  BackInStockNotificationValues,
  createBackInStockNotificationRequest,
} from "@/app/wix-api/backInStockNotification";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotificationValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        (error as any).details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "Již odebíráte tento produkt.",
        });
      } else {
        toast({
            variant: "destructive",
            description: "Něco se pokazilo, prosím opakujte akci.",
        })
      }
    },
  });
}
