/**
 * Icon library powered by @mui/icons-material (Outlined variants).
 * Outlined MUI icons have a thin, lineal style that closely matches
 * the Zoom Workplace icon language.
 *
 * All exports keep the same API (className / style props).
 */

import React, { CSSProperties } from "react";

// ── Outlined variants (thin lineal style) ─────────────────────────────────────
import MicOutlined from "@mui/icons-material/MicOutlined";
import MicOffOutlined from "@mui/icons-material/MicOffOutlined";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import VideocamOffOutlined from "@mui/icons-material/VideocamOffOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import EmojiEmotionsOutlined from "@mui/icons-material/EmojiEmotionsOutlined";
import ScreenShareOutlined from "@mui/icons-material/ScreenShareOutlined";
import AppsOutlined from "@mui/icons-material/AppsOutlined";
import RadioButtonCheckedOutlined from "@mui/icons-material/RadioButtonCheckedOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import BackHand from "@mui/icons-material/BackHand";
import EditOutlined from "@mui/icons-material/EditOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import StopCircleOutlined from "@mui/icons-material/StopCircleOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

// ── Regular variants (already visually "outlined" — no filled area to remove) ─
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import MoreVert from "@mui/icons-material/MoreVert";
import Close from "@mui/icons-material/Close";
import Remove from "@mui/icons-material/Remove";
import CropSquare from "@mui/icons-material/CropSquare";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

// ─────────────────────────────────────────────────────────────────────────────
// Prop type — same surface API as all previous versions
// ─────────────────────────────────────────────────────────────────────────────
interface IconProps {
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/** Maps our generic IconProps to MUI SvgIcon props.
 *  `fontSize: "inherit"` lets Tailwind w-X / h-X classes control the size.
 */
function mp({ className, style, "aria-label": ariaLabel }: IconProps) {
  return {
    className,
    style: { fontSize: "inherit", ...style },
    "aria-label": ariaLabel,
    fontSize: "inherit" as const,
  };
}

// ─── Microphone ──────────────────────────────────────────────────────────────
export function MicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path d="M7.5 4.5C7.5 2.01 9.51 0 12 0s4.5 2.01 4.5 4.5V12c0 2.49-2.01 4.5-4.5 4.5S7.5 14.49 7.5 12V4.5ZM12 15c1.65 0 3-1.35 3-3V4.5c0-1.65-1.35-3-3-3s-3 1.35-3 3V12c0 1.65 1.35 3 3 3Z" fill="currentColor"/>
      <path d="M19.485 12.15c.015-.045.015-.105.015-.15 0-.42-.33-.75-.75-.75s-.75.33-.75.75c0 3.315-2.685 6-6 6s-6-2.685-6-6c0-.42-.33-.75-.75-.75s-.75.33-.75.75c0 .045 0 .105.015.15.06 3.81 2.985 6.93 6.735 7.305V22.5h-3c-.42 0-.75.33-.75.75s.33.75.75.75h7.5c.42 0 .75-.33.75-.75s-.33-.75-.75-.75h-3v-3.045c3.75-.375 6.675-3.495 6.735-7.305Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Microphone Off ──────────────────────────────────────────────────────────
export function MicOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.145 3.816a.617.617 0 0 0 .167-.61A4.495 4.495 0 0 0 12 0C9.51 0 7.5 2.01 7.5 4.5v7.125c0 .284.34.43.546.236l.719-.678A.75.75 0 0 0 9 10.637V4.5c0-1.65 1.35-3 3-3s3 1.35 3 3c0 .17.206.255.326.135l.819-.819ZM16.5 6.29 15 7.79V12c0 1.65-1.35 3-3 3a3.008 3.008 0 0 1-2.637-1.574L8.269 14.52A4.491 4.491 0 0 0 12 16.5c2.49 0 4.5-2.01 4.5-4.5V6.29ZM5.915 14.046a.857.857 0 0 0 .217-.789A6.028 6.028 0 0 1 6 12c0-.42-.33-.75-.75-.75s-.75.33-.75.75c0 .045 0 .105.015.15.009.553.078 1.091.2 1.608.131.548.802.686 1.2.288Zm.214 2.614 1.066-1.066A5.99 5.99 0 0 0 12 18c3.315 0 6-2.685 6-6 0-.42.33-.75.75-.75s.75.33.75.75c0 .045 0 .105-.015.15-.06 3.81-2.985 6.93-6.735 7.305V22.5h3c.42 0 .75.33.75.75s-.33.75-.75.75h-7.5c-.42 0-.75-.33-.75-.75s.33-.75.75-.75h3v-3.045a7.489 7.489 0 0 1-5.12-2.795Z" fill="currentColor"/>
      <path d="m3.375 19.875 17.25-17.25" stroke="#F05" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Video Camera ────────────────────────────────────────────────────────────
export function VideoIcon(props: IconProps) {
  return <VideocamOutlined {...mp(props)} />;
}

// ─── Video Camera Off ────────────────────────────────────────────────────────
export function VideoOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path d="M15.137 4.802c.269-.268.29-.704-.002-.946A3.735 3.735 0 0 0 12.75 3H3A2.25 2.25 0 0 0 .75 5.25v8.25c0 1.385.751 2.595 1.869 3.245.223.13.502.073.685-.11.37-.369.15-1.076-.25-1.411A2.245 2.245 0 0 1 2.25 13.5V5.25A.75.75 0 0 1 3 4.5h9.75c.433 0 .837.122 1.18.334.376.232.895.28 1.207-.032ZM6.31 15.75h7.94A.75.75 0 0 0 15 15V7.06l1.353-1.353c.096.331.147.681.147 1.043V15a2.25 2.25 0 0 1-2.25 2.25H4.81l1.5-1.5ZM22.846 4.585a.75.75 0 0 1 .404.665V15a.75.75 0 0 1-1.18.614l-3.75-2.625a.75.75 0 0 1 .86-1.228l2.57 1.799V6.69l-2.57 1.8a.75.75 0 1 1-.86-1.23l3.75-2.624a.75.75 0 0 1 .776-.051Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M20.78 2.22a.75.75 0 0 1 0 1.06L3.53 20.53a.75.75 0 0 1-1.06-1.06L19.72 2.22a.75.75 0 0 1 1.06 0Z" fill="#F05"/>
    </svg>
  );
}

// ─── Shield / Security ───────────────────────────────────────────────────────
export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path d="M11.968 11.444V5.44c-1.677 0-4.19.563-5.994 1.4 0 0-.078 2.693.245 4.603h5.75Z" fill="currentColor"/>
      <path d="M11.968 19v-7.556h5.75c-.168.912-.344 2.452-2.148 4.426-1.52 1.663-3.195 2.84-3.602 3.13Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.508 5.493c-.012.937-.023 2.165.069 3.52.124 1.832.43 3.698 1.084 5.116.637 1.379 2.049 2.948 3.59 4.34A32.62 32.62 0 0 0 12 20.688a32.622 32.622 0 0 0 2.749-2.22c1.541-1.392 2.953-2.961 3.59-4.34.656-1.422.96-3.242 1.084-5.043.094-1.362.08-2.608.069-3.593a10.441 10.441 0 0 0-.245-.111 19.183 19.183 0 0 0-1.995-.731C15.648 4.155 13.72 3.75 12 3.75c-1.72 0-3.648.405-5.252.9-.794.247-1.482.506-1.995.732-.089.039-.17.076-.245.111Zm16.476-.86c0 .22.003.474.007.758.028 2.274.079 6.4-1.29 9.366-1.54 3.336-6.418 6.949-7.701 7.743-1.283-.794-6.16-4.407-7.7-7.743-1.374-2.975-1.318-7.277-1.29-9.44.003-.261.006-.492.006-.685C3.658 4.037 8.15 2.25 12 2.25c3.85 0 8.342 1.787 8.984 2.382Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Person / Participant ────────────────────────────────────────────────────
export function PersonIcon(props: IconProps) {
  return <PersonOutlined {...mp(props)} />;
}

// ─── People / Participants ───────────────────────────────────────────────────
export function PeopleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.75 6.75a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm1.5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm1.5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 15.75a4.5 4.5 0 0 1 4.5-4.5H9c1.259 0 2.398.518 3.214 1.35a.75.75 0 1 1-1.072 1.05A2.989 2.989 0 0 0 9 12.75H7.5a3 3 0 0 0-3 3V18A1.5 1.5 0 0 0 6 19.5h3A.75.75 0 0 1 9 21H6a3 3 0 0 1-3-3v-2.25Zm11.531-1.5a4.031 4.031 0 0 0-4.031 4.031A2.719 2.719 0 0 0 13.219 21h5.062A2.719 2.719 0 0 0 21 18.281a4.031 4.031 0 0 0-4.031-4.031H14.53ZM12 18.281a2.531 2.531 0 0 1 2.531-2.531h2.438a2.531 2.531 0 0 1 2.531 2.531c0 .673-.546 1.219-1.219 1.219H13.22A1.219 1.219 0 0 1 12 18.281Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.297 9.5c-1.718 0-3.31.207-4.588.451-1.46.279-2.459 1.62-2.459 3.22V17A3.75 3.75 0 0 0 6 20.75h2.02l.168.52c.163.508.215 1.15.024 1.724a3.481 3.481 0 0 1-.057.158c1.015-.33 2.113-.945 2.863-2.068l.222-.334h1.51A3.75 3.75 0 0 0 16.5 17v-3.8c0-1.656-1.072-3.042-2.604-3.299A28.172 28.172 0 0 0 9.297 9.5Zm-4.87-1.022A26.213 26.213 0 0 1 9.297 8c1.8 0 3.484.194 4.846.422C16.498 8.816 18 10.916 18 13.2V17c0 2.9-2.35 5.25-5.25 5.25h-.723c-1.71 2.235-4.425 2.682-5.672 2.747a.812.812 0 0 1-.842-.64.818.818 0 0 1 .454-.907 1.48 1.48 0 0 0 .821-.93.983.983 0 0 0 .045-.27H6A5.25 5.25 0 0 1 .75 17v-3.829c0-2.202 1.401-4.259 3.678-4.693Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.209 4.701a24.715 24.715 0 0 1 4.588-.451c1.696 0 3.295.183 4.599.401C19.928 4.908 21 6.294 21 7.951v3.799a3.74 3.74 0 0 1-1.18 2.73.958.958 0 0 0-.32.689c0 .615.64 1.007 1.113.612A5.24 5.24 0 0 0 22.5 11.75v-3.8c0-2.284-1.502-4.384-3.857-4.778a29.67 29.67 0 0 0-4.846-.422c-1.834 0-3.523.22-4.87.478-1.475.282-2.583 1.245-3.18 2.488-.238.496.196.994.744.936a.963.963 0 0 0 .712-.489c.429-.752 1.136-1.296 2.006-1.462ZM6.75 15.125a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm3.75 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm2.625 1.125a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Emoji / React ───────────────────────────────────────────────────────────
export function EmojiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.226 22.043a1.5 1.5 0 0 1-1.696-.471c-1.189-1.479-2.9-4.056-5.134-7.425l-.741-1.116C.841 10.3.311 7.567 1.195 5.285 2.082 2.993 4.226 1.6 6.797 1.201c2.242-.348 4.194.842 5.454 1.925a12.537 12.537 0 0 1 1.615 1.68l.004.006.007-.003a12.137 12.137 0 0 1 2.221-.615c1.621-.282 3.892-.3 5.656 1.161 2.024 1.675 3.188 3.987 2.825 6.425-.36 2.427-2.165 4.512-5.075 5.93l-1.19.58c-3.588 1.752-6.334 3.092-8.089 3.753Zm4.493-15.935c-.683.238-1.183.49-1.355.622-.084-.203-.39-.68-.863-1.238-1.133-1.34-3.217-3.152-5.46-2.804-4.39.681-6.434 4.565-3.146 9.516l.723 1.088c2.26 3.406 3.928 5.92 5.07 7.34 1.686-.634 4.365-1.941 7.994-3.712l1.16-.565c5.276-2.572 5.425-6.982 1.97-9.842-1.764-1.461-4.456-.975-6.093-.405Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Share Screen ────────────────────────────────────────────────────────────
export function ShareScreenIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M24 18.75V5.25a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v13.5a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3ZM7.758 13.32a.69.69 0 0 0 1.009 0l1.807-1.915v5.849c0 .412.32.746.713.746h1.426c.394 0 .713-.334.713-.746v-5.85l1.807 1.917a.691.691 0 0 0 1.009 0l1.008-1.056a.77.77 0 0 0 0-1.055L12.504 6.22a.69.69 0 0 0-1.008 0L6.75 11.21a.77.77 0 0 0 0 1.055l1.008 1.056Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Apps / Grid ─────────────────────────────────────────────────────────────
export function AppsIcon(props: IconProps) {
  return <AppsOutlined {...mp(props)} />;
}

// ─── Record (filled dot — intentionally kept filled for semantic clarity) ────
export function RecordIcon(props: IconProps) {
  return <RadioButtonCheckedOutlined {...mp(props)} />;
}

// ─── Info Circle ─────────────────────────────────────────────────────────────
export function InfoIcon(props: IconProps) {
  return <InfoOutlined {...mp(props)} />;
}

// ─── More Horizontal (ellipsis) ──────────────────────────────────────────────
export function MoreHorizontalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <rect x="0.75" y="1.75" width="22.5" height="22.5" rx="11.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18 14.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/>
    </svg>
  );
}

// ─── More Vertical ───────────────────────────────────────────────────────────
export function MoreVerticalIcon(props: IconProps) {
  return <MoreVert {...mp(props)} />;
}

// ─── AI Sparkle ──────────────────────────────────────────────────────────────
export function SparkleIcon(props: IconProps) {
  return <AutoAwesomeOutlined {...mp(props)} />;
}

// ─── Host Tools ──────────────────────────────────────────────────────────────
export function HostToolsIcon(props: IconProps) {
  return <TuneOutlined {...mp(props)} />;
}

// ─── Hand Raise ──────────────────────────────────────────────────────────────
export function HandRaiseIcon(props: IconProps) {
  return <BackHand {...mp(props)} />;
}

// ─── Close / X ───────────────────────────────────────────────────────────────
export function CloseIcon(props: IconProps) {
  return <Close {...mp(props)} />;
}

// ─── Minimize / Dash ─────────────────────────────────────────────────────────
export function MinimizeIcon(props: IconProps) {
  return <Remove {...mp(props)} />;
}

// ─── Maximize / Square ───────────────────────────────────────────────────────
export function MaximizeIcon(props: IconProps) {
  return <CropSquare {...mp(props)} />;
}

// ─── Edit / Pencil ───────────────────────────────────────────────────────────
export function EditIcon(props: IconProps) {
  return <EditOutlined {...mp(props)} />;
}

// ─── Eye / View ──────────────────────────────────────────────────────────────
export function EyeIcon(props: IconProps) {
  return <VisibilityOutlined {...mp(props)} />;
}

// ─── Chevron Down (caret) ────────────────────────────────────────────────────
export function ChevronDownIcon(props: IconProps) {
  return <KeyboardArrowDown {...mp(props)} />;
}

// ─── Send ────────────────────────────────────────────────────────────────────
export function SendIcon(props: IconProps) {
  return <SendOutlined {...mp(props)} />;
}

// ─── Message (composer input) ────────────────────────────────────────────────
export function MessageIcon(props: IconProps) {
  return <ChatBubbleOutlined {...mp(props)} />;
}

// ─── Stop ────────────────────────────────────────────────────────────────────
export function StopIcon(props: IconProps) {
  return <StopCircleOutlined {...mp(props)} />;
}

// ─── Clock / Timer ───────────────────────────────────────────────────────────
export function ClockIcon(props: IconProps) {
  return <AccessTimeOutlined {...mp(props)} />;
}

// ─── Search / Magnifier ──────────────────────────────────────────────────────
export function SearchIcon(props: IconProps) {
  return <SearchOutlined {...mp(props)} />;
}
