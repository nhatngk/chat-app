import Spinner from "~/assets/svg/Spinner"

const Loading = () => {
    return (
        <div role="status" className="w-full h-full absolute top-0 left-0 bg-disabled z-50">
            <div className="flex-center mt-[50vh]">
                <Spinner />
                Loading...
            </div>
        </div>
    )
}

export default Loading