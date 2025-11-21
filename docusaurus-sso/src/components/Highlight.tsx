import React from 'react';

interface HighlightProps {
    children: React.ReactNode;
    color: string;
}

export default function Highlight({ children, color }: HighlightProps) {
    const style: React.CSSProperties = {
        backgroundColor: color,
        borderRadius: '20px',
        color: '#fff',
        padding: '10px',
        cursor: 'pointer',
    };

    const handleClick = () => {
        alert(`You clicked the color ${color} with label ${children}`);
    };

    return (
        <span style={style} onClick={handleClick}>
            {children}
        </span>
    );
}
