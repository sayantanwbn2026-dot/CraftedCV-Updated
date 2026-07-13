import { LucideIcon } from "lucide-react";

interface ContactIconProps {
  Icon: LucideIcon;
  text: string;
  className?: string;
  iconSize?: number;
}

/**
 * ContactIcon - A wrapper component for icons that ensures proper alignment
 * in both web preview and PDF export (html2canvas renders SVG differently)
 * Uses inline styles and table display for consistent PDF rendering
 */
const ContactIcon = ({ Icon, text, className = "text-black", iconSize = 12 }: ContactIconProps) => {
  return (
    <div 
      style={{ 
        display: "inline-table",
        verticalAlign: "middle",
      }}
    >
      <span 
        style={{ 
          display: "table-cell",
          verticalAlign: "middle",
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          paddingRight: "4px",
        }}
      >
        <Icon 
          className={`${className}`}
          style={{ 
            display: "block",
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            minWidth: `${iconSize}px`,
            minHeight: `${iconSize}px`,
          }} 
        />
      </span>
      <span 
        style={{ 
          display: "table-cell",
          verticalAlign: "middle",
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default ContactIcon;
