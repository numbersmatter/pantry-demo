import { Link } from "@remix-run/react";
import { Button } from "../shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";




export function DropdownNavMenu(
  { menuItems, onSelect, menuTitle, menuLabel }: {
    menuItems: { label: string, textValue: string }[];
    onSelect: (value: string) => void;
    menuTitle: string;
    menuLabel: string;
  }
) {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{menuTitle}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          menuItems.map((item) => {
            return (
              <DropdownMenuItem
                key={item.textValue}
                textValue={item.textValue}
                onSelect={(e) => onSelect(item.textValue)}
              >
                {item.label}
              </DropdownMenuItem>
            )
          })
        }

      </DropdownMenuContent>
    </DropdownMenu>
  )
}