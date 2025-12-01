import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react"
import type React from "react"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type PolymorphicAsProp<E extends ElementType> = {
  as?:
    | E
    | React.ComponentType<Omit<ComponentPropsWithoutRef<E>, "as">>
    | React.FunctionComponent<Omit<ComponentPropsWithoutRef<E>, "as">>
}

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  Omit<ComponentPropsWithoutRef<E>, "as"> & PolymorphicAsProp<E>
>

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 font-caption text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-xl font-semibold tracking-tight transition-colors md:text-2xl lg:text-3xl",
      h3: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "text-lg leading-7 not-first:mt-6",
      base: "text-lg",
      quote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "font-semibold md:text-lg",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      link: "font-medium text-cyan-600 hover:underline dark:text-primary",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})
type TypographyCvaProps = VariantProps<typeof typographyVariants>

const defaultElement = "base"

const defaultElementMapping: Record<
  NonNullable<TypographyCvaProps["variant"]>,
  ElementType
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  quote: "blockquote" as "p",
  code: "code",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  link: "a",
  base: "p",
} as const

export function Typography<E extends ElementType = typeof defaultElement>({
  as,
  children,
  className,
  variant,
  ...restProps
}: PolymorphicProps<E> & TypographyCvaProps) {
  const Component: ElementType =
    as ?? defaultElementMapping[variant ?? "base"] ?? defaultElement

  return (
    <Component
      {...(restProps as ComponentPropsWithoutRef<E>)}
      className={cn(typographyVariants({ variant }), className)}
      data-typography
      data-typography-variant={variant}
    >
      {children}
    </Component>
  )
}
