import React from 'react';

export const AmbientColor = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none">
      <div
        style={{
          transform: 'translateY(-320px) rotate(-35deg)',
          width: '640px',
          height: '1380px',
          background:
            'radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(37, 99, 235, 0.18) 0, rgba(37, 99, 235, 0.02) 55%, rgba(37, 99, 235, 0) 85%)',
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          transform: 'rotate(-35deg) translate(5%, -50%)',
          transformOrigin: 'top left',
          width: '240px',
          height: '1380px',
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(94, 234, 212, 0.16) 0, rgba(94, 234, 212, 0.03) 75%, transparent 100%)',
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          position: 'absolute',
          borderRadius: '20px',
          transform: 'rotate(-35deg) translate(-160%, -70%)',
          transformOrigin: 'top left',
          top: 0,
          left: 0,
          width: '240px',
          height: '1380px',
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(245, 158, 11, 0.18) 0, rgba(245, 158, 11, 0.02) 80%, transparent 100%)',
        }}
        className="absolute top-0 left-0"
      />
    </div>
  );
};
