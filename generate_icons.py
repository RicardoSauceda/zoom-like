import os
import re

svg_dir = "svg-2"
output_file = "app/components/Icons.tsx"

# Map of componentName -> filename
icon_map = {
    "MicIcon": "zoom-mic-mute.svg",
    "MicOffIcon": "zoom-mic-unmute.svg",
    "VideoIcon": "zoom-video-enable.svg",
    "VideoOffIcon": "zoom-video-disable.svg",
    "ShieldIcon": "zoom-security.svg",
    "PeopleIcon": "zoom-participant.svg",
    "ChatIcon": "zoom-chat.svg",
    "EmojiIcon": "zoom-reactions.svg",
    "ShareScreenIcon": "zoom-share.svg",
    "MoreHorizontalIcon": "zoom-more.svg",
    "RecordIcon": "zoom-local-record.svg",
    "InfoIcon": "zoom-meeting-info.svg",
    "AppsIcon": "zoom-zapps.svg",
    # AI companion special case
    "SparkleIcon": "zoom-ai-companion.svg",
    # End and leave meeting
    "EndMeetingIcon": "zoom-end.svg",
    "LeaveMeetingIcon": "zoom-leave-meeting.svg",
}

header = '''import React from "react";
import { SvgIconProps } from "@mui/material";

export type IconProps = React.SVGProps<SVGSVGElement> & { className?: string; viewBox?: string };

// Helper para merge props
function mp(props: IconProps) {
  return {
    ...props,
    className: props.className || "",
  };
}

// Chevron
export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

// EditIcon
export function EditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

// HostTools
export function HostToolsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

// Person
export function PersonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

// MoreVerticalIcon
export function MoreVerticalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  );
}

'''

mic_active = '''
/**
 * Active microphone with animated audio-level fill.
 */
export function MicActiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...mp(props)}>
      <defs>
        <clipPath id="micAudioClip">
          <rect x="0" y="8" width="24" height="8">
            <animate
              attributeName="y"
              values="8;2;12;1;9;4;13;2;7;8"
              dur="1.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.1;0.2;0.35;0.45;0.6;0.7;0.8;0.9;1"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
            />
            <animate
              attributeName="height"
              values="8;14;4;15;7;12;3;14;9;8"
              dur="1.8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.1;0.2;0.35;0.45;0.6;0.7;0.8;0.9;1"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
            />
          </rect>
        </clipPath>
      </defs>

      {/* Layer 1: green fill clipped to animated level */}
      <g clipPath="url(#micAudioClip)">
        {/* We use the base mic shape without the hole, M7.5 4.5... */}
        <path d="M7.5 4.5C7.5 2.01 9.51 0 12 0C14.49 0 16.5 2.01 16.5 4.5V12C16.5 14.49 14.49 16.5 12 16.5C9.51 16.5 7.5 14.49 7.5 12V4.5Z" fill="#18d26e"/>
      </g>

      {/* Layer 2: white donut ring */}
      <path d="M7.5 4.5C7.5 2.01 9.51 0 12 0C14.49 0 16.5 2.01 16.5 4.5V12C16.5 14.49 14.49 16.5 12 16.5C9.51 16.5 7.5 14.49 7.5 12V4.5ZM12 15C13.65 15 15 13.65 15 12V4.5C15 2.85 13.65 1.5 12 1.5C10.35 1.5 9 2.85 9 4.5V12C9 13.65 10.35 15 12 15Z" fill="currentColor"/>

      {/* Stand / arm */}
      <path d="M19.485 12.15C19.5 12.105 19.5 12.045 19.5 12C19.5 11.58 19.17 11.25 18.75 11.25C18.33 11.25 18 11.58 18 12C18 15.315 15.315 18 12 18C8.685 18 6 15.315 6 12C6 11.58 5.67 11.25 5.25 11.25C4.83 11.25 4.5 11.58 4.5 12C4.5 12.045 4.5 12.105 4.515 12.15C4.575 15.96 7.5 19.08 11.25 19.455V22.5H8.25C7.83 22.5 7.5 22.83 7.5 23.25C7.5 23.67 7.83 24 8.25 24H15.75C16.17 24 16.5 23.67 16.5 23.25C16.5 22.83 16.17 22.5 15.75 22.5H12.75V19.455C16.5 19.08 19.425 15.96 19.485 12.15Z" fill="currentColor"/>
    </svg>
  );
}
'''

def clean_svg(svg_content):
    # Extract just the inner parts, and the viewBox
    viewBox_match = re.search(r'viewBox="([^"]+)"', svg_content)
    viewBox = viewBox_match.group(1) if viewBox_match else "0 0 24 24"
    
    # Remove <zoom> tags completely
    content = re.sub(r'<zoom[^>]*/>', '', svg_content)
    
    # Extract inner tags
    inner_match = re.search(r'<svg[^>]*>(.*)</svg>', content, re.DOTALL | re.IGNORECASE)
    inner = inner_match.group(1) if inner_match else content
    
    # Replace fill="white" and fill="#FFFFFF" (case insensitive) with fill="currentColor"
    inner = re.sub(r'fill="white"', 'fill="currentColor"', inner, flags=re.IGNORECASE)
    inner = re.sub(r'fill="#ffffff"', 'fill="currentColor"', inner, flags=re.IGNORECASE)
    inner = re.sub(r'stroke="white"', 'stroke="currentColor"', inner, flags=re.IGNORECASE)
    
    # Fix React camelCase attributes
    inner = inner.replace('clip-rule', 'clipRule')
    inner = inner.replace('fill-rule', 'fillRule')
    inner = inner.replace('stroke-width', 'strokeWidth')
    inner = inner.replace('stroke-linecap', 'strokeLinecap')
    inner = inner.replace('stroke-linejoin', 'strokeLinejoin')
    inner = inner.replace('fill-opacity', 'fillOpacity')
    
    # SparkleIcon (AI Companion) specific edge-case fixes
    # It has things like stop-color
    inner = inner.replace('stop-color', 'stopColor')
    inner = inner.replace('gradientTransform', 'gradientTransform') # same
    inner = inner.replace('gradientUnits', 'gradientUnits') # same

    return viewBox, inner.strip()

out_lines = [header, mic_active]

for comp_name, filename in icon_map.items():
    filepath = os.path.join(svg_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            svg_content = f.read()
        
        vb, inner = clean_svg(svg_content)
        
        comp = f"""
export function {comp_name}(props: IconProps) {{
  return (
    <svg viewBox="{vb}" fill="none" xmlns="http://www.w3.org/2000/svg" {{...mp(props)}}>
      {inner}
    </svg>
  );
}}
"""
        out_lines.append(comp)

with open(output_file, "w") as f:
    f.write("\n".join(out_lines))
    
print("Successfully generated Icons.tsx")
