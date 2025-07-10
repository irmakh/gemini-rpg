
import React from 'react';

export const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.318M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const PlayerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const MonsterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v1.286a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-.008A8.238 8.238 0 0111.25 4.533zM12.75 4.533A9.707 9.707 0 0118 3a9.735 9.735 0 013.25.555.75.75 0 01.5.707v1.286a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75h.008A8.238 8.238 0 0012.75 4.533zM6 9a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 016 9zm12 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0118 9zm-3.365 7.152A.75.75 0 0115 15.75v.56a1.5 1.5 0 01-3 0v-.56a.75.75 0 01.365-.638l.003-.001.003-.002a5.235 5.235 0 014.264 0l.003.002.003.001zM12 1.5a10.5 10.5 0 110 21 10.5 10.5 0 010-21z" />
    </svg>
);

export const ChestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15v-1.5H1.5V15c0 1.036.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15zM22.5 13.5V6.375c0-1.035-.84-1.875-1.875-1.875h-5.25V13.5h7.125zM15 15v1.125c0 .414.336.75.75.75h3a3 3 0 116 0h.375c1.035 0 1.875-.84 1.875-1.875V15H15z" />
  </svg>
);

export const ExitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.975.435-.975.975v6.025c0 .425.28.79.67.925a.748.748 0 00.83-.225l3.438-3.999a.75.75 0 000-1.002L10.884 9.5a.75.75 0 00-.83-.225.748.748 0 00-.67.925v.025h-.025a.97.97 0 01-.975-.975z" clipRule="evenodd" />
    </svg>
);

export const HealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-22.045 22.045 0 01-2.582-1.901 20.758 20.758 0 01-1.162-.682l-.019-.01-.005-.003h-.002a.739.739 0 01-.69-1.06l.154-.308a.739.739 0 01.535-.424v-4.11c0-.414.336-.75.75-.75h9.5c.414 0 .75.336.75.75v4.11c0 .179.06.347.164.48l.154.308a.739.739 0 01-.155 1.059l-.002.001-.005.003-.019.01a20.759 20.759 0 01-1.162.682 22.045 22.045 0 01-2.582 1.9-22.045 22.045 0 01-2.582 1.901 20.758 20.758 0 01-1.162.682l-.019-.01-.005-.003h-.002z" />
  </svg>
);

export const ManaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10 3.5a1.5 1.5 0 011.06.44l4.25 4.25a1.5 1.5 0 010 2.12l-4.25 4.25a1.5 1.5 0 01-2.12 0L5.44 10.31a1.5 1.5 0 010-2.12l4.25-4.25A1.5 1.5 0 0110 3.5z" />
    </svg>
);


export const XPIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.75 3.565a.75.75 0 00-1.5 0v3.448l-2.12-2.12a.75.75 0 00-1.06 1.06l2.12 2.12H5.115a.75.75 0 000 1.5h3.448l-2.12 2.12a.75.75 0 101.06 1.06l2.12-2.12v3.448a.75.75 0 001.5 0v-3.448l2.12 2.12a.75.75 0 101.06-1.06l-2.12-2.12h3.448a.75.75 0 000-1.5h-3.448l2.12-2.12a.75.75 0 00-1.06-1.06l-2.12 2.12V3.565z" />
    </svg>
);

export const LevelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59l-2.1-2.1a.75.75 0 00-1.06 1.061l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06l-2.1 2.1V6.75z" clipRule="evenodd" />
    </svg>
);

export const StrengthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-5.84 7.38m5.84 2.58v4.8m0-11.13a2.62 2.62 0 11-5.24 0 2.62 2.62 0 015.24 0z" />
  </svg>
);

export const DexterityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const IntelligenceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 15.223 2.25 10.5 2.25 5.852 6.152 2 10.8 2c4.648 0 8.55 3.852 8.55 8.5 0 4.723-2.258 9.14-5.85 9.811z" />
  </svg>
);

export const WeaponIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 8.318l-6.364 6.364-1.06-1.06 6.364-6.364 1.06 1.06zm-4.242 5.304L2.818 15.75l-.707-.707 2.121-2.121.707.707-1.414 1.414 2.121 2.121.707-.707-1.414-1.414 2.828-2.828.707.707-1.414 1.414 1.414 1.414.707-.707-2.121-2.121.707-.707 1.414 1.414 1.414-1.414.707.707-1.414 1.414zM21.182 3.818l-6.364 6.364-1.06-1.06 6.364-6.364 1.06 1.06z" />
  </svg>
);

export const ArmorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" />
  </svg>
);

export const RingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const PotionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21.75H13.5v-1.5H10.5v1.5zM12 2.25c-4.142 0-7.5 3.358-7.5 7.5 0 2.246 1.01 4.28 2.58 5.679l-.38.6A.75.75 0 007.5 17.25h9a.75.75 0 00.55-.221l-.38-.6C17.49 14.03 18.5 12.006 18.5 9.75c0-4.142-3.358-7.5-6.5-7.5zm0 1.5c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z" />
  </svg>
);

export const MiscIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const QuestMarkerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.243-.662 1.564 0l1.83 3.778 4.161.605c.73.106 1.022.998.494 1.512l-3.01 2.934.71 4.144c.126.726-.638 1.283-1.296.952L10 15.127l-3.71 1.95c-.658.332-1.422-.226-1.296-.952l.71-4.144L2.704 8.78c-.528-.514-.236-1.406.494-1.512l4.16-.605 1.83-3.778z" clipRule="evenodd" />
    </svg>
);

export const TrapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
    </svg>
);

export const VendorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.064c.54.06 1.057.185 1.54.364a.75.75 0 01.52 1.11l-1.12 1.983c.404.24.78.532 1.117.869l1.982-1.12a.75.75 0 011.11.52c.179.483.304.999.364 1.54a.75.75 0 01-.75.75h-.064a.75.75 0 000 1.5h.064a.75.75 0 01.75.75c-.06.54-.185 1.057-.364 1.54a.75.75 0 01-1.11.52l-1.983-1.12a5.973 5.973 0 01-1.117.869l1.12 1.982a.75.75 0 01-.52 1.11c-.483.179-1 .304-1.54.364a.75.75 0 01-.75-.75v-.064a.75.75 0 00-1.5 0v.064a.75.75 0 01-.75.75c-.54-.06-1.057-.185-1.54-.364a.75.75 0 01-.52-1.11l1.12-1.983a5.973 5.973 0 01-1.117-.869l-1.982 1.12a.75.75 0 01-1.11-.52A9.45 9.45 0 012.25 10a.75.75 0 01.75-.75h.064a.75.75 0 000-1.5H3a.75.75 0 01-.75-.75c.06-.54.185-1.057.364-1.54a.75.75 0 011.11-.52l1.983 1.12c.337-.337.713-.628 1.117-.869L5.72 4.118a.75.75 0 01.52-1.11c.483-.179 1-.304 1.54-.364A.75.75 0 0110 2zM4.5 10a5.5 5.5 0 1011 0 5.5 5.5 0 00-11 0z" clipRule="evenodd" />
    </svg>
);


export const WallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10 3.75a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" />
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.518a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.122 4.122a.75.75 0 011.06 0l.53.53a.75.75 0 01-1.06 1.06l-.53-.53a.75.75 0 010-1.06zM13.288 4.122a.75.75 0 010 1.06l-.53.53a.75.75 0 11-1.06-1.06l.53-.53a.75.75 0 011.06 0zM17.25 10a.75.75 0 01-.75.75h-.518a.75.75 0 010-1.5h.518a.75.75 0 01.75.75zM10 17.25a.75.75 0 01-.75-.75v-.518a.75.75 0 011.5 0v.518a.75.75 0 01-.75.75zM14.878 14.878a.75.75 0 01-1.06 0l-.53-.53a.75.75 0 011.06-1.06l.53.53a.75.75 0 010 1.06zM6.712 14.878a.75.75 0 010-1.06l.53-.53a.75.75 0 111.06 1.06l-.53.53a.75.75 0 01-1.06 0zM3.75 10a.75.75 0 01.75-.75h.518a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);

export const FloorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10 8a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M2.5 5.5A.5.5 0 003 6v8a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5H3a.5.5 0 00-.5.5zM16 14H4V6h12v8z" clipRule="evenodd" />
    </svg>
);

export const BackpackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H5.502c-.656 0-1.19-.585-1.12-1.243l1.263-12A1.125 1.125 0 016.63 8.5h10.74c.613 0 1.13.44 1.156 1.007zM8.25 10.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z" />
  </svg>
);