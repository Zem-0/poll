import React from 'react';

interface TextProps {
  variant: 'h1' | 'h2' | 'h3' | 'body15R' | 'body15SB' | 'body15M' | 'body13R' | 'body13M';
  children: React.ReactNode;
  extraCSS?: string; // Allow additional Tailwind or custom styles
}

const Text: React.FC<TextProps> = ({ variant, children, extraCSS = '' }) => {
  const baseStyle = 'text-[#333333] '; // Default color for text (Primary color)

  // Define the styles for each variant
  const styles = {
    h1: `font-garamond text-[40px] leading-[3rem] ${baseStyle}`, // Garamond for Header 1 (40px)
    h2: `font-bold text-[28px] leading-[3rem] ${baseStyle}`,     // Inter 28px, Bold for Header 2
    h3: `font-bold text-[22px] leading-[2rem] ${baseStyle}`,     // Inter 22px, Bold for Header 3
    body15R: `font-normal text-[15px] leading-[1.3rem] ${baseStyle}`,   // Inter 15px, Regular for body text
    body15SB: `font-semibold text-[15px] leading-[1.5rem] ${baseStyle}`,// Inter 15px, Semibold for emphasized body text
    body15M: `font-medium text-[15px] leading-[1.5rem] ${baseStyle}`,   // Inter 15px, Medium for button text
    body13R: `font-normal text-[13px] leading-[1.25rem] ${baseStyle}`,   // Inter 13px, Regular for secondary text
    body13M: `font-medium text-[13px] leading-[1.25rem] ${baseStyle}`,   // Inter 13px, Medium for secondary text with emphasis
  };

  switch (variant) {
    case 'h1':
      return <h1 className={`${styles.h1} ${extraCSS}`}>{children}</h1>;
    case 'h2':
      return <h2 className={`${styles.h2} ${extraCSS}`}>{children}</h2>;
    case 'h3':
      return <h3 className={`${styles.h3} ${extraCSS}`}>{children}</h3>;
    case 'body15R':
    case 'body15SB':
    case 'body15M':
    case 'body13R':
    case 'body13M':
      return <p className={`${styles[variant]} ${extraCSS}`}>{children}</p>;
    default:
      return <p className={`${styles.body15R} ${extraCSS}`}>{children}</p>;
  }

};

export default Text;
