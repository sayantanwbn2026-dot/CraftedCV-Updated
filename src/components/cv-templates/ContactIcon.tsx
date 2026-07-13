import { LucideIcon } from "lucide-react";

interface ContactIconProps {
  Icon: LucideIcon;
  text: string;
  className?: string;
  iconSize?: number;
}

/**
 * ContactIcon - Renders an icon + text pair with rock-solid alignment and
 * pixel-perfect, undistorted icons across web preview AND html2canvas PDF export.
 *
 * Why the extra props matter (this is the fix for stretched/distorted icons in
 * exported PDFs): html2canvas has two SVG rendering paths (foreignObject vs.
 * element clone) whose behavior differs per browser. If the SVG's intrinsic
 * `width`/`height` *attributes* (Lucide defaults to 24) don't match the CSS
 * render size, some browsers rasterize the 24px artwork into the smaller
 * clipped box and the icon comes out stretched/squished. We therefore:
 *   1. Pass `size` + explicit `width`/`height` so the SVG's *attributes* equal
 *      the exact render size — no attribute-vs-CSS mismatch for html2canvas.
 *   2. Force `preserveAspectRatio="xMidYMid meet"` so the square 24x24 viewBox
 *      can never be non-uniformly scaled.
 *   3. Keep a fixed-size flex box with min/max locks + flexShrink:0 so no
 *      parent (flex row, sidebar column, grid, table) can compress it.
 */
const ContactIcon = ({
  Icon,
  text,
  className = "text-black",
  iconSize = 12,
}: ContactIconProps) => {
  const boxStyle = {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    minWidth: `${iconSize}px`,
    minHeight: `${iconSize}px`,
    maxWidth: `${iconSize}px`,
    maxHeight: `${iconSize}px`,
    flexShrink: 0,
    flexGrow: 0,
  } as const;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        lineHeight: 1,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...boxStyle,
        }}
      >
        <Icon
          className={className}
          // Match the SVG's intrinsic attributes to the render size so
          // html2canvas cannot rasterize a 24px icon into a 12px box.
          size={iconSize}
          width={iconSize}
          height={iconSize}
          strokeWidth={2}
          // Guarantee the square viewBox is never non-uniformly scaled.
          preserveAspectRatio="xMidYMid meet"
          style={{
            display: "block",
            ...boxStyle,
          }}
        />
      </span>
      <span style={{ lineHeight: 1, display: "inline-block" }}>{text}</span>
    </span>
  );
};

export default ContactIcon;
