export type Monster = {
  id: string;
  label: string;
  svg: React.ReactNode;
};

export const MONSTERS: Monster[] = [
  {
    id: "cyclops-happy",
    label: "a happy one-eyed blue monster",
    svg: (
      <g transform="translate(3,4)">
        <ellipse cx="50" cy="56" rx="34" ry="30" fill="#5c7cff" stroke="#0a0a0f" strokeWidth="5" />
        <path
          d="M28 32 Q34 16 44 26"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M72 32 Q66 16 56 26"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="52" r="15" fill="#fff" stroke="#0a0a0f" strokeWidth="5" />
        <circle cx="54" cy="52" r="6" fill="#0a0a0f" />
        <circle cx="56" cy="49" r="2" fill="#fff" />
        <path
          d="M40 68 Q50 76 62 66"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    ),
  },
  {
    id: "spiky-surprised",
    label: "a surprised pink spiky monster",
    svg: (
      <g transform="translate(3,4)">
        <path
          d="M50 10 L62 28 L78 22 L74 40 L90 50 L74 60 L78 78 L62 72 L50 90 L38 72 L22 78 L26 60 L10 50 L26 40 L22 22 L38 28 Z"
          fill="#ff2e7e"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="48" r="11" fill="#fff" stroke="#0a0a0f" strokeWidth="5" />
        <circle cx="62" cy="48" r="11" fill="#fff" stroke="#0a0a0f" strokeWidth="5" />
        <circle cx="40" cy="48" r="4" fill="#0a0a0f" />
        <circle cx="64" cy="48" r="4" fill="#0a0a0f" />
        <path d="M42 66 Q50 60 58 66 L54 76 Q50 80 46 76 Z" fill="#0a0a0f" />
      </g>
    ),
  },
  {
    id: "ghost-sleepy",
    label: "a sleepy teal ghost-shaped monster",
    svg: (
      <g transform="translate(3,4)">
        <path
          d="M20 55 Q18 20 50 18 Q82 20 80 55 Q80 78 65 78 Q60 68 55 78 Q50 68 45 78 Q40 68 35 78 Q20 78 20 55 Z"
          fill="#2fe6d4"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M32 46 Q37 42 42 46"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M58 46 Q63 42 68 46"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <ellipse cx="50" cy="60" rx="6" ry="8" fill="#0a0a0f" />
        <path d="M80 20 L84 28 L92 30 L84 32 L80 40 L76 32 L68 30 L76 28 Z" fill="#fff" />
      </g>
    ),
  },
  {
    id: "horned-mischief",
    label: "a mischievous winking gold horned monster",
    svg: (
      <g transform="translate(3,4)">
        <ellipse cx="50" cy="55" rx="32" ry="32" fill="#f0c93e" stroke="#0a0a0f" strokeWidth="5" />
        <path d="M32 24 L38 8 L44 26 Z" fill="#f0c93e" stroke="#0a0a0f" strokeWidth="5" strokeLinejoin="round" />
        <path d="M56 26 L62 8 L68 24 Z" fill="#f0c93e" stroke="#0a0a0f" strokeWidth="5" strokeLinejoin="round" />
        <path
          d="M30 48 Q37 44 44 48"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="64" cy="50" r="10" fill="#fff" stroke="#0a0a0f" strokeWidth="5" />
        <circle cx="67" cy="50" r="4" fill="#0a0a0f" />
        <path
          d="M38 68 Q50 78 62 66"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M50 74 Q52 82 47 84" fill="none" stroke="#e8355f" strokeWidth="5" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "dizzy-blob",
    label: "a dizzy purple antenna monster",
    svg: (
      <g transform="translate(3,4)">
        <line x1="50" y1="10" x2="50" y2="20" stroke="#0a0a0f" strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="8" r="6" fill="#e026c9" stroke="#0a0a0f" strokeWidth="5" />
        <path
          d="M18 58 Q16 24 50 22 Q84 24 82 58 Q82 82 50 82 Q18 82 18 58 Z"
          fill="#6a1bb0"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M32 44 L42 54 M42 44 L32 54"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M58 44 L68 54 M68 44 L58 54"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M38 66 Q50 60 62 66"
          fill="none"
          stroke="#0a0a0f"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    ),
  },
];
