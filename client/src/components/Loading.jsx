import Spinner from "~/assets/svg/Spinner"

const Loading = () => {
    return (
        <div role="status" className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
            <div class="flex justify-center items-center mt-[50vh]">
                <Spinner />
                Loading...
            </div>
        </div>
    )
}

export default Loading