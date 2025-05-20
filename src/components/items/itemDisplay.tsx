"use client";

import * as React from "react";
import { useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book, ShoppingCart, Weight } from "lucide-react";
import { BaseItem } from "@/types/items/base";
import { formatName, getRarityColor, getTypeIcon } from "@/data/items/itemUtils";
import { useDialog } from "../../contexts/dialogContext";
import { useItems } from "@/contexts/itemContext";
import { cn } from "@/lib/utils";

type ItemCardProps = {
	item?: BaseItem;
	variant?: "default" | "icon";
	count?: number;
	onClick?: () => void;
};

const ItemCardComponent = React.memo(function ItemCard({ item, variant = "default", count = undefined, onClick }: ItemCardProps) {
  const { openDialog } = useDialog();
  const { setDialogQueue } = useItems();
  
  // Memoize the icon to prevent unnecessary re-renders
  const itemIcon = useMemo(() => {
    if (!item?.icon) return null;
    return (
      <item.icon
        className={cn("w-8 h-8 mb-1", getRarityColor(item.rarity, "text"))}
      />
    );
  }, [item?.icon, item?.rarity]);

  const handleClick = useCallback(() => {
    if (!item) return;
    if (onClick) {
      onClick();
    } else {
      setDialogQueue((prev) => [...prev, item]);
      openDialog("item", item);
    }
  }, [item, onClick, openDialog, setDialogQueue]);

  if (!item) return null;

  if (variant === "icon") {
    return (
      <div
        className="flex flex-col items-center justify-between border-2 border-secondary-foreground/20 hover:border-primary/60 rounded p-2 min-w-[60px] aspect-square cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-1">
          {itemIcon}
          {count !== undefined && (
            <span className="text-lg font-mono text-center">
              x{count > 0 ? count : "?"}
            </span>
          )}
        </div>
        <span
          className="text-xs font-mono text-center w-[70px] h-[32px] leading-tight break-words line-clamp-2 overflow-hidden"
          title={item.name}
        >
          {item.name}
        </span>
      </div>
    );
  }

  return (
    <Card
      onClick={handleClick}
      className="flex flex-row items-center gap-2 p-1 pr-2 max-w-[300px] md:max-w-[400px] rounded-lg w-full h-16 bg-transparent border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {/* Item Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-md h-full border-2 p-2",
          getRarityColor(item.rarity, "border")
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(
              "w-full h-full",
              getRarityColor(item.rarity, "text")
            )}
          />
        )}
      </div>
      <div className="flex flex-col flex-1 w-full h-full">
        <div className="min-w-fit flex flex-1 flex-row items-center justify-between">
          <div className="text-nowrap truncate max-w-[180px]">{item.name}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {React.createElement(getTypeIcon(item.category), {
                  size: 16,
                })}
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{formatName(item.category)}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="min-w-fit flex flex-1 flex-row items-center gap-3">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Weight
              size={12}
              strokeWidth={4}
            />
            <span className="text-sm font-mono tabular-nums">
              {item.weight}kg
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <ShoppingCart
                size={12}
                strokeWidth={4}
              />
              <span className="text-sm font-mono tabular-nums">
                ${item.value}
              </span>
            </div>
          </div>
          {item.recipe && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-4 h-4 flex items-center justify-center">
                  <Book className="w-3 h-3" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Craftable</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
			</Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.item?.id === nextProps.item?.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.count === nextProps.count
  );
});

export { ItemCardComponent as ItemCard };
