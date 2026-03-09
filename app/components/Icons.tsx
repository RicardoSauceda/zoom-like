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
  return <MicOutlined {...mp(props)} />;
}

// ─── Microphone Off ──────────────────────────────────────────────────────────
export function MicOffIcon(props: IconProps) {
  return <MicOffOutlined {...mp(props)} />;
}

// ─── Video Camera ────────────────────────────────────────────────────────────
export function VideoIcon(props: IconProps) {
  return <VideocamOutlined {...mp(props)} />;
}

// ─── Video Camera Off ────────────────────────────────────────────────────────
export function VideoOffIcon(props: IconProps) {
  return <VideocamOffOutlined {...mp(props)} />;
}

// ─── Shield / Security ───────────────────────────────────────────────────────
export function ShieldIcon(props: IconProps) {
  return <ShieldOutlined {...mp(props)} />;
}

// ─── Person / Participant ────────────────────────────────────────────────────
export function PersonIcon(props: IconProps) {
  return <PersonOutlined {...mp(props)} />;
}

// ─── People / Participants ───────────────────────────────────────────────────
export function PeopleIcon(props: IconProps) {
  return <PeopleOutlined {...mp(props)} />;
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export function ChatIcon(props: IconProps) {
  return <ChatOutlined {...mp(props)} />;
}

// ─── Emoji / React ───────────────────────────────────────────────────────────
export function EmojiIcon(props: IconProps) {
  return <EmojiEmotionsOutlined {...mp(props)} />;
}

// ─── Share Screen ────────────────────────────────────────────────────────────
export function ShareScreenIcon(props: IconProps) {
  return <ScreenShareOutlined {...mp(props)} />;
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
  return <MoreHoriz {...mp(props)} />;
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
