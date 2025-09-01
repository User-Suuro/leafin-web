"use client";

import { Button } from "@/shadcn/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/shadcn/ui/tooltip";
import { Check, X, Trash, Edit } from "lucide-react";



export default function TableActions({ 
  onAction, 
  batchType, 
  batchId 
}: { 
  onAction?: (action: "harvest" | "discard" | "delete" | "edit", batchId: number) => void,
  batchType: "fish" | "plant",
  batchId: number
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onAction?.("harvest", batchId)}>
            <Check className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Harvest</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onAction?.("discard", batchId)}>
            <X className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Discard</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" size="icon" onClick={() => onAction?.("delete", batchId)}>
            <Trash className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => onAction?.("edit", batchId)}>
            <Edit className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

