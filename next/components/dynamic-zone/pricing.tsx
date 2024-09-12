"use client";

import React from "react";
import { Container } from "../container";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { IconCheck, IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "../elements/button";

type Perks = {
  [key: string]: string;
}

type CTA = {
  [key: string]: string;
}

type Plan = {
  name: string;
  price: number;
  perks: Perks[];
  additional_perks: Perks[];
  description: string;
  number: string;
  featured?: boolean;
  CTA?: CTA | undefined;
};

export const Pricing = ({ heading, sub_heading, plans }: { heading: string, sub_heading: string, plans: any[] }) => {
  const onClick = (plan: Plan) => {
    console.log("click", plan);
  };
  return (
    <div className="pt-40">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {sub_heading}
        </Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <Card onClick={() => onClick(plan)} key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        "p-4 md:p-4 rounded-3xl bg-neutral-900 border-2 border-neutral-800",
        plan.featured && "border-neutral-50 bg-neutral-100"
      )}
    >
      <div
        className={cn(
          "p-4 bg-neutral-800 rounded-2xl shadow-[0px_-1px_0px_0px_var(--neutral-700)]",
          plan.featured && "bg-white shadow-aceternity"
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn("font-medium", plan.featured && "text-black")}>
            {plan.name}
          </p>
          {plan.featured && (
            <div
              className={cn(
                "font-medium text-xs px-3 py-1 rounded-full relative bg-neutral-900"
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
              Featured
            </div>
          )}
        </div>
        <div className="mt-8">
          {plan.price && (
            <span
              className={cn(
                "text-lg font-bold text-neutral-500",
                plan.featured && "text-neutral-700"
              )}
            >
              $
            </span>
          )}
          <span
            className={cn("text-4xl font-bold", plan.featured && "text-black")}
          >
            {plan.price || plan?.CTA?.text}
          </span>
          {plan.price && (
            <span
              className={cn(
                "text-lg font-normal text-neutral-500 ml-2",
                plan.featured && "text-neutral-700"
              )}
            >
              / launch
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className={cn(
            "w-full mt-10 mb-4",
            plan.featured &&
            "bg-black text-white hover:bg-black/80 hover:text-white"
          )}
          onClick={onClick}
        >
          {plan?.CTA?.text}
        </Button>
      </div>
      <div className="mt-1 p-4">
        {plan.perks.map((feature, idx) => (
          <Step featured={plan.featured} key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
      {plan.additional_perks && plan.additional_perks.length > 0 && (
        <Divider featured={plan.featured} />
      )}
      <div className="p-4">
        {plan.additional_perks?.map((feature, idx) => (
          <Step featured={plan.featured} additional key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
    </div>
  );
};

const Step = ({
  children,
  additional,
  featured,
}: {
  children: React.ReactNode;
  additional?: boolean;
  featured?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5",
          additional ? "bg-indigo-600" : "bg-neutral-700"
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div
        className={cn(
          "font-medium text-white text-sm",
          featured && "text-black"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn("w-full h-px bg-neutral-950", featured && "bg-white")}
      />
      <div
        className={cn(
          "w-full h-px bg-neutral-800",
          featured && "bg-neutral-200"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 h-5 w-5 m-auto rounded-xl bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center",
          featured && "bg-white shadow-aceternity"
        )}
      >
        <IconPlus
          className={cn(
            "h-3 w-3 [stroke-width:4px] text-neutral-300",
            featured && "text-black"
          )}
        />
      </div>
    </div>
  );
};
