import React from 'react';

export function Services({
  heading,
  sub_heading,
}: {
  heading: string;
  sub_heading: string;
}) {
  console.log(sub_heading);

  return (
    <div className="h-screen w-full flex flex-col bg-[#eff6ff]">
      <div></div> 
      <h2 className="text-primary text-5xl text-center font-bold">{heading}</h2>
      <p className="text-black text-center text-lg">{sub_heading}</p>
    </div>
  );
}
