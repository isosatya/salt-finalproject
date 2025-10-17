import React, { useState } from "react";

/**
 * Image component with fallback support
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.fallback - Fallback image URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS class name
 * @param {Object} props.style - Inline styles
 */
function ImageWithFallback({ src, fallback, alt, className, style, ...props }) {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImageSrc(fallback);
        }
    };

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
            onError={handleError}
            {...props}
        />
    );
}

export default ImageWithFallback;
