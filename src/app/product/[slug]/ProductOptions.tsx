"use client";

import { Label } from "@/components/ui/label";
import { products } from "@wix/stores";

interface IProductOptions {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export default function ProductOptions({
  product,
  selectedOptions,
  setSelectedOptions,
}: IProductOptions) {
  return (
    <div className="space-y-2.5">
      {product.productOptions?.map((option) => (
        <fieldset key={option.name} className="space-y-1.5">
          <legend>
            <Label asChild>
              <span>{option.name}</span>
            </Label>
          </legend>

          <div className="flex flex-wrap items-center gap-1.5">
            {option.choices?.map((choise) => (
              <div key={choise.description}>
                <input
                  type="radio"
                  id={choise.description}
                  name={option.name}
                  value={choise.description}
                  checked={
                    selectedOptions[option.name || ""] === choise.description
                  }
                  onChange={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name || ""]: choise.description || "",
                    })
                  }
                  className="peer hidden"
                />
                <Label
                  htmlFor={choise.description}
                  className="flex items-center justify-center min-w-14 cursor-pointer gap-1.5 border p-2 peer-checked:border-blue-400 peer-checked:border-2"
                >
                  {option.optionType === products.OptionType.color && (
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: choise.value }}
                    ></span>
                  )}
                  <span>{choise.description}</span>
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
