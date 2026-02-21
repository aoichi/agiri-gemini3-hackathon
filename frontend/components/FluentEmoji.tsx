/* eslint-disable @next/next/no-img-element */

const CDN = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';

const png3d = (folder: string, file: string) =>
  `${CDN}/${folder}/3D/${file}_3d.png`;

const colorSvg = (folder: string, file: string) =>
  `${CDN}/${folder}/Color/${file}_color.svg`;

const EMOJI_MAP: Record<string, string> = {
  // ─── style icons (3D single-word, confirmed working) ───
  cyclone:           png3d('Cyclone', 'cyclone'),
  collision:         png3d('Collision', 'collision'),
  sparkles:          png3d('Sparkles', 'sparkles'),
  bullseye:          png3d('Bullseye', 'bullseye'),
  brain:             png3d('Brain', 'brain'),
  house:             png3d('House', 'house'),

  // ─── action icons (3D single-word) ───
  'high-voltage':    png3d('High%20voltage', 'high_voltage'),
  'crossed-swords':  png3d('Crossed%20swords', 'crossed_swords'),
  'party-popper':    png3d('Party%20popper', 'party_popper'),
  'magnifying-glass-tilted-left': png3d(
    'Magnifying%20glass%20tilted%20left',
    'magnifying_glass_tilted_left',
  ),

  // ─── face avatars (Color SVG — universally available) ───
  'smirking-face':   colorSvg('Smirking%20face', 'smirking_face'),
  'exploding-head':  colorSvg('Exploding%20head', 'exploding_head'),
  'zany-face':       colorSvg('Zany%20face', 'zany_face'),

  // ─── nav / ui icons ───
  'back-arrow':      colorSvg('Left%20arrow', 'left_arrow'),
  wrench:            png3d('Wrench', 'wrench'),
  paintbrush:        png3d('Paintbrush', 'paintbrush'),
};

interface FluentEmojiProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export default function FluentEmoji({
  name,
  size = 24,
  className,
  alt,
}: FluentEmojiProps) {
  const src = EMOJI_MAP[name];
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt ?? name}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
}
