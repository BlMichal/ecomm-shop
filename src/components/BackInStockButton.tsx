import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const formSchema = z.object({
  email: requiredString.email(),
});

type FormValues = z.infer<typeof formSchema>;

interface BackInStockButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export default function BackInStockButton({
  product,
  selectedOptions,
  ...props
}: BackInStockButtonProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const a = {...props}
  console.log(a)
  const mutation = useCreateBackInStockNotificationRequest();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Notifikace</Button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
    <DialogTitle>Notifikace</DialogTitle>
      </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
