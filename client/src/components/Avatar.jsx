const Avatar = (props) => {
    const { srcImg, size } = props;
    return (
        <div>
            <img
                src={srcImg}
                alt="avatar"
                className= {`rounded-full size-${size}`}
            />
        </div>
    )
}
export default Avatar