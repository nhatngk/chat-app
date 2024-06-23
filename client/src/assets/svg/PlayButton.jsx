const PlayButton = ({size}) => {
    return (
        <svg className={`size-${size}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="#00000033 " stroke="currentColor" stroke-width="10" />
            <polygon points="85,65 85,135 135,100" fill="currentColor" />
        </svg>
    )
}

export default PlayButton
