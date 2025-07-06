import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Weapon } from "@/types";

type WeaponSelectionBarProps =
  | {
      selectedWeapon: Weapon | null;
      setSelectedId: (id: string | null) => void;
      showStats: boolean;
      setShowStats: (show: boolean) => void;
      isMobile: true;
    }
  | {
      selectedWeapon: Weapon | null;
      setSelectedId: (id: string | null) => void;
      showStats: boolean;
      setShowStats?: undefined;
      isMobile: false;
    };

export function WeaponSelectionBar(props: WeaponSelectionBarProps) {
	if (props.isMobile) {
  const { selectedWeapon, showStats, setShowStats, setSelectedId } = props;
  return (
    <div
      className={cn(
        "flex items-center gap-2 sticky top-0 z-99 bg-background transition-all duration-400 ease-in-out p-2",
        selectedWeapon ? "h-16 opacity-100" : "h-0 opacity-0"
      )}
    >
      <p className="font-semibold">Selected Weapon:</p>
      <p className="text-sm text-muted-foreground">{selectedWeapon?.name}</p>
      <Button
        onClick={() => setShowStats(!showStats)}
        variant="default"
        className="ml-auto font-mono"
      >
        {showStats ? "Hide Stats" : "Show Stats"}
      </Button>
    </div>
  );
} else {
  const { selectedWeapon, setSelectedId } = props;
  return (
    <div>
      <button
        onClick={() => setSelectedId(null)}
        className="font-mono p-2 bg-card rounded-lg cursor-pointer"
      >
        Change Weapon
      </button>
    </div>
  );
}
}
