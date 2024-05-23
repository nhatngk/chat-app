import React from 'react'

const HoverInfo = ({ text, direction }) => {
    return (
        <div className={`children ${direction}`}>
            {text}
        </div>
    )
}

export default HoverInfo