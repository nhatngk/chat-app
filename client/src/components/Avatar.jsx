const Avatar = ({ srcImg, size }) => {
    return (
        <div>
            <img
                src={srcImg}
                alt="avatar"
                className= {`rounded-full size-12 size-${size}`}
            />
        </div>
    )
}
export default Avatar