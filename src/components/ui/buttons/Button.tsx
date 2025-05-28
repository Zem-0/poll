"use client";

import React, { useState } from "react";
import styles from "./Button.module.css";
import Text from "../Texts/Text";

interface ButtonProps {
  label?: string;
  type?: "primaryBlack" | "outline" | "delete" | "primaryBlue" | "primaryWhite" | "gradient";
  iconSrc?: string;
  iconHoverSrc?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  clickAnimation?: boolean; // Optional prop for the click animation
  onClick?: (e?:Event) => void;
  customCss?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = "primaryBlack",
  iconSrc,
  iconHoverSrc,
  iconPosition = "right",
  loading = false,
  disabled = false,
  fullWidth = false,
  clickAnimation = false, // Default click animation is disabled
  onClick,
  customCss = "",
}) => {
  const [animate, setAnimate] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(iconSrc);

  const handleHover = (e: React.MouseEvent) => {
    if(disabled) return;
    const target = e.currentTarget as HTMLButtonElement;
    const span = target.querySelector("span")!;
    const { left, top } = target.getBoundingClientRect();
    const relX = e.pageX - left;
    const relY = e.pageY - top;
    span.style.top = `${relY}px`;
    span.style.left = `${relX}px`;

    // Change the icon on hover
    if (iconHoverSrc) setCurrentIcon(iconHoverSrc);
  };

  const handleMouseLeave = () => {
    if (iconSrc) setCurrentIcon(iconSrc); // Revert to original icon on mouse leave
  };

  const handleClick = () => {
    if (clickAnimation) {
      setAnimate(true); // Trigger the animation
      setTimeout(() => {
        setAnimate(false); // Reset animation after 700ms
      }, 700);
    }

    if (onClick) {
      onClick();
    }
  };

  const buttonClass = `${styles.btn}  ${
    type === "primaryBlack"
      ? styles.primaryBlack
      : type === "outline"
        ? styles.outline
        : type === "delete"
          ? styles.delete
          : type == "primaryBlue"
            ? styles.primaryBlue
            : type == "gradient"
              ? styles.gradient
              : styles.primaryWhite
  } ${fullWidth && "w-full"} ${animate && styles.animate} ${loading && styles.loading} 
   ${!label && iconSrc && styles.onlyIconBtn} rounded-lg ${customCss}`;

  return (
    <button
      className={buttonClass}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      <div className={styles.effectDiv}>
        {
          !disabled &&(
            <span className={styles.effect}></span>
          )
        }
      </div>
       {/* Loading overlay */}
    {loading && <div className={styles.overlay}><div className={styles.loader}></div></div>}
    
    {/* Button content */}
        <>
          {iconSrc && iconPosition === "left" && (
            <img src={currentIcon} className={loading ? "opacity-0" : "opacity-100"} alt="icon"/>
          )}
          <Text variant="body15M" extraCSS={loading ? "text-inherit opacity-0" : "text-inherit"}>
            {label}
          </Text>
          {iconSrc && iconPosition === "right" && (
            <img src={currentIcon} className={loading ? "opacity-0" : "opacity-100"} alt="icon"/>
          )}
        </>
    </button>
  );
};

export default Button;
