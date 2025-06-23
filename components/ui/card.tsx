import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a styled card container for grouping related content.
 *
 * Combines default card styles with any additional class names and spreads extra props onto the root div.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-gray-900/50 text-white flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-800 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the header section of a card with grid layout and responsive styling.
 *
 * Applies container queries and adjusts grid columns if a card action is present. Additional props are spread onto the underlying div.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the title section of a card with emphasized font styling.
 *
 * Use within a card layout to display the main heading or title content.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/**
 * Renders a styled description section within a card component.
 *
 * Applies muted foreground color and small text size for secondary card text.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Renders a card action area positioned in the card header grid layout.
 *
 * Use this component to display actions such as buttons or menus aligned to the end of the card header.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the content section of a card with horizontal padding.
 *
 * Additional props are spread onto the underlying div element.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/**
 * Renders the footer section of a card with horizontal padding and flex alignment.
 *
 * Additional props are spread onto the underlying div element.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
