'use client';

import React from 'react';

import { TeamMember } from '@/types/types';
import TeamMemberCard from './features/TeamMemberCard';
import { Typography } from '../ui/typography';

type NotreEquipeHomeProps = {
  heading: string;
  sub_heading: string;
  team_members: TeamMember[];
  locale: string;
};

export function NotreEquipeHome({
  heading,
  sub_heading,
  team_members = [],
  locale,
}: NotreEquipeHomeProps) {
  return (
    <section className="w-full flex flex-col items-center py-18 px-4 md:px-10 gap-10">
      <Typography variant={'h2'} className="text-primary text-center">
        {heading}
      </Typography>

      <Typography
        variant={'p'}
        className="text-black text-center max-w-2xl not-first:mt-2"
      >
        {sub_heading}
      </Typography>

      <div className="flex flex-col md:flex-row gap-2 justify-center w-full max-w-6xl">
        {team_members.map((teammember, index) => (
          <TeamMemberCard
            key={teammember.slug || index}
            member={teammember}
            initialSize={200}
            hoverSize={350} index={index} />

        ))}
      </div>
    </section>
  );
}